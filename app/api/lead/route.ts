import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";

const AGENT_ID = "agent_4501kx8pad7qea483yt72ybbmpyb";
const COOKIE = "al_trials";
// One instant no-details go per browser, then details unlock two more.
const FREE_GOES = 1;
const MAX_GOES = 3;
const FREE_CALL_SECONDS = 120;
const GATED_CALL_SECONDS = 300;
const TRIAL_WINDOW_MS = 24 * 60 * 60 * 1000;
const IP_LIMIT = 6;
const IP_WINDOW_MS = 60 * 60 * 1000;

type Kind = "open-trial" | "trial" | "callback" | "contact";

// Best-effort per-IP throttle. Serverless instances recycle, so this is a
// speed bump, not a wall — the locked agent (server-minted tokens only), the
// signed cookie, and the agent-side 5-minute call cap are the real limits.
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
      ? `🔥 HOT LEAD — heard the demo, wants their own: ${fields.name}`
      : kind === "contact"
        ? `New demo request — ${fields.name}`
        : `Extra demo go — ${fields.name}`;
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

async function mintToken(): Promise<string | null> {
  const elKey = process.env.ELEVENLABS_API_KEY;
  if (!elKey) return null;
  const res = await fetch(
    `https://api.elevenlabs.io/v1/convai/conversation/token?agent_id=${AGENT_ID}`,
    { headers: { "xi-api-key": elKey } }
  );
  if (!res.ok) {
    console.error("lead: token mint failed", res.status, await res.text());
    return null;
  }
  const { token } = await res.json();
  return token || null;
}

function withTrialCookie(res: NextResponse, count: number, start: number) {
  res.cookies.set(COOKIE, `${count}.${start}.${sign(`${count}.${start}`)}`, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: TRIAL_WINDOW_MS / 1000,
  });
  return res;
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

  if (!["open-trial", "trial", "callback", "contact"].includes(kind))
    return NextResponse.json({ error: "Bad request." }, { status: 400 });

  if (kind !== "open-trial") {
    if (name.length < 2)
      return NextResponse.json({ error: "Chuck your name in first." }, { status: 400 });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email))
      return NextResponse.json({ error: "That email doesn't look right." }, { status: 400 });
    if (!/^(\+?64|0)[\d\s-]{7,12}$/.test(phone))
      return NextResponse.json(
        { error: "That mobile doesn't look right — NZ numbers only." },
        { status: 400 }
      );
  }

  const ip = (req.headers.get("x-forwarded-for") || "unknown").split(",")[0].trim();
  const ua = req.headers.get("user-agent") || "";
  const trials = readTrials(req);
  const wantsCall = kind === "open-trial" || kind === "trial";

  if (wantsCall) {
    if (kind === "open-trial" && trials.count >= FREE_GOES)
      // Free taste used up — the client swaps to the details form.
      return NextResponse.json(
        { gate: true, error: "Chuck your details in for another go." },
        { status: 429 }
      );
    if (kind === "trial" && trials.count >= MAX_GOES)
      return NextResponse.json(
        {
          error:
            "You've had a good run on the demo. Want more? We'll build you your own version — free. Hit the contact page.",
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

  // Capture the lead when we have details. Never block the caller on email.
  if (kind !== "open-trial")
    await emailLead(
      kind,
      { name, email, phone, website, notes },
      {
        when: new Date().toLocaleString("en-NZ", { timeZone: "Pacific/Auckland" }),
        goes: wantsCall ? `${trials.count + 1} of ${MAX_GOES} today` : "",
        ip,
        browser: ua.slice(0, 120),
      }
    ).catch((e) => console.error("lead: email error", e));

  if (!wantsCall) return NextResponse.json({ ok: true });

  const token = await mintToken();
  if (!token)
    return NextResponse.json(
      { error: "Couldn't start the call — give it another go in a minute." },
      { status: 502 }
    );

  const count = trials.count + 1;
  const start = trials.count === 0 ? Date.now() : trials.start;
  const maxSeconds = kind === "open-trial" ? FREE_CALL_SECONDS : GATED_CALL_SECONDS;
  return withTrialCookie(NextResponse.json({ ok: true, token, maxSeconds }), count, start);
}
