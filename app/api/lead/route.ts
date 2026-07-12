import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";

const AGENT_ID = "agent_4501kx8pad7qea483yt72ybbmpyb";
const COOKIE = "al_trials";
const TRIALS_PER_BROWSER = 2;
const TRIAL_WINDOW_MS = 24 * 60 * 60 * 1000;
const IP_LIMIT = 6;
const IP_WINDOW_MS = 60 * 60 * 1000;

type Kind = "trial" | "callback" | "contact";

// Best-effort per-IP throttle. Serverless instances recycle, so this is a
// speed bump, not a wall — the signed cookie and the agent-side 5-minute
// call cap are the real limits.
const ipHits: Map<string, { count: number; start: number }> =
  (globalThis as { __alIpHits?: Map<string, { count: number; start: number }> })
    .__alIpHits ?? new Map();
(globalThis as { __alIpHits?: typeof ipHits }).__alIpHits = ipHits;

function sign(payload: string) {
  const secret = process.env.LEAD_GATE_SECRET || "al-dev-secret";
  return createHmac("sha256", secret).update(payload).digest("hex").slice(0, 16);
}

function readTrials(req: NextRequest): { count: number; start: number } {
  const raw = req.cookies.get(COOKIE)?.value;
  const fresh = { count: 0, start: Date.now() };
  if (!raw) return fresh;
  const [count, start, sig] = raw.split(".");
  if (!count || !start || !sig || sign(`${count}.${start}`) !== sig) return fresh;
  if (Date.now() - Number(start) > TRIAL_WINDOW_MS) return fresh;
  return { count: Number(count), start: Number(start) };
}

function esc(s: string) {
  return s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
}

async function emailLead(
  kind: Kind,
  fields: Record<string, string>,
  meta: Record<string, string>
) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.error("lead: RESEND_API_KEY missing — lead not emailed", fields);
    return;
  }
  const to = (process.env.LEAD_TO_EMAIL || "hello@theanswerline.kiwi")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const from =
    process.env.LEAD_FROM_EMAIL || "The Answer Line <leads@app.industrydjschool.com>";
  const subject =
    kind === "callback"
      ? `🔥 HOT LEAD — wants their own agent: ${fields.name}`
      : kind === "contact"
        ? `New demo request — ${fields.name}`
        : `Demo trial — ${fields.name} is talking to the agent`;
  const rows = Object.entries({ ...fields, ...meta })
    .filter(([, v]) => v)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 14px 6px 0;color:#888;text-transform:capitalize;vertical-align:top">${esc(
          k
        )}</td><td style="padding:6px 0;color:#111;white-space:pre-wrap">${esc(v)}</td></tr>`
    )
    .join("");
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to,
      reply_to: fields.email,
      subject,
      html: `<div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.5"><table>${rows}</table></div>`,
    }),
  });
  if (!res.ok) console.error("lead: resend failed", res.status, await res.text());
}

export async function POST(req: NextRequest) {
  let body: Record<string, string>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }

  const kind = (body.kind as Kind) || "contact";
  const name = (body.name || "").trim().slice(0, 100);
  const email = (body.email || "").trim().slice(0, 200);
  const phone = (body.phone || "").trim().slice(0, 30);
  const website = (body.website || "").trim().slice(0, 300);
  const notes = (body.notes || "").trim().slice(0, 2000);

  // Honeypot — real people never see this field. Bots get a quiet "success".
  if (body.company) return NextResponse.json({ ok: true });

  if (!["trial", "callback", "contact"].includes(kind))
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  if (name.length < 2)
    return NextResponse.json({ error: "Chuck your name in first." }, { status: 400 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email))
    return NextResponse.json({ error: "That email doesn't look right." }, { status: 400 });
  if (kind !== "callback" && !/^(\+?64|0)[\d\s-]{7,12}$/.test(phone))
    return NextResponse.json(
      { error: "That mobile doesn't look right — NZ numbers only." },
      { status: 400 }
    );

  const ip = (req.headers.get("x-forwarded-for") || "unknown").split(",")[0].trim();
  const ua = req.headers.get("user-agent") || "";
  const trials = readTrials(req);

  if (kind === "trial") {
    if (trials.count >= TRIALS_PER_BROWSER)
      return NextResponse.json(
        {
          error:
            "You've had a couple of goes already. Want more? We'll build you your own version — free. Hit the contact page.",
        },
        { status: 429 }
      );
    const hit = ipHits.get(ip);
    if (hit && Date.now() - hit.start < IP_WINDOW_MS) {
      if (hit.count >= IP_LIMIT)
        return NextResponse.json(
          { error: "The demo line's copping a hammering — try again in a bit." },
          { status: 429 }
        );
      hit.count++;
    } else {
      ipHits.set(ip, { count: 1, start: Date.now() });
    }
    if (ipHits.size > 5000) ipHits.clear();
  }

  // Capture the lead. Never block the caller's experience on email delivery.
  await emailLead(
    kind,
    { name, email, phone, website, notes },
    {
      when: new Date().toLocaleString("en-NZ", { timeZone: "Pacific/Auckland" }),
      trial: kind === "trial" ? `${trials.count + 1} of ${TRIALS_PER_BROWSER} today` : "",
      ip,
      browser: ua.slice(0, 120),
    }
  ).catch((e) => console.error("lead: email error", e));

  if (kind !== "trial") return NextResponse.json({ ok: true });

  const elKey = process.env.ELEVENLABS_API_KEY;
  if (!elKey) return NextResponse.json({ error: "Demo's offline right now." }, { status: 502 });
  const tokenRes = await fetch(
    `https://api.elevenlabs.io/v1/convai/conversation/token?agent_id=${AGENT_ID}`,
    { headers: { "xi-api-key": elKey } }
  );
  if (!tokenRes.ok) {
    console.error("lead: token mint failed", tokenRes.status, await tokenRes.text());
    return NextResponse.json(
      { error: "Couldn't start the call — give it another go in a minute." },
      { status: 502 }
    );
  }
  const { token } = await tokenRes.json();

  const next = { count: trials.count + 1, start: trials.count === 0 ? Date.now() : trials.start };
  const res = NextResponse.json({ ok: true, token });
  res.cookies.set(COOKIE, `${next.count}.${next.start}.${sign(`${next.count}.${next.start}`)}`, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: TRIAL_WINDOW_MS / 1000,
  });
  return res;
}
