"use client";

import { useState } from "react";

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const f = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "contact",
          name: f.get("name"),
          email: f.get("email"),
          phone: f.get("mobile"),
          website: f.get("website"),
          notes: f.get("notes"),
          company: f.get("company"),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "That didn't send — give it another go.");
      setEmail((f.get("email") as string) || "");
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "That didn't send — give it another go.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl px-6 pb-24 pt-40">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-blue-400">
        Contact
      </p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
        Get your own version — free
      </h1>
      <p className="mt-5 leading-relaxed text-white/60">
        Leave your details and we&rsquo;ll build a version that answers like{" "}
        <em>your</em> business — your trade, your service area, your callers —
        and send it to your inbox with a quick quote. Try to trip it up, hear
        what your customers would hear. Costs you nothing.
      </p>

      {sent ? (
        <div className="mt-10 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 leading-relaxed text-white/80">
          Done — it&rsquo;s underway. Your own version and a quick quote will land at{" "}
          <span className="font-semibold text-white">{email}</span>, usually within a day.
        </div>
      ) : (
        <form className="mt-10 space-y-5" onSubmit={submit}>
          <Field label="Name" name="name" type="text" required placeholder="Dave Smith" />
          <Field label="Email" name="email" type="email" required placeholder="dave@smithplumbing.co.nz" />
          <Field label="Mobile" name="mobile" type="tel" required placeholder="027 123 4567" />
          <Field
            label="Your website (if you've got one)"
            name="website"
            type="text"
            placeholder="smithplumbing.co.nz"
          />
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-white/70">
              Anything it&rsquo;d need to know that&rsquo;s not on your website? (optional)
            </span>
            <textarea
              name="notes"
              rows={4}
              placeholder="e.g. No payments over the phone — just capture the job and I ring back · what counts as an emergency for you · service area · jobs you don't take"
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm leading-relaxed text-white placeholder:text-white/30 outline-none transition focus:border-blue-500 focus:bg-white/10"
            />
          </label>
          <input
            type="text"
            name="company"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="hidden"
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-full bg-blue-600 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:opacity-60"
          >
            {busy ? "Sending…" : "Build mine — free"}
          </button>
        </form>
      )}

      <p className="mt-8 text-center text-sm leading-relaxed text-white/45">
        Auckland-based, run by a real person. No lock-in contracts, no hard
        sell — if it&rsquo;s not for you, no hard feelings. Or email{" "}
        <a href="mailto:hello@theanswerline.kiwi" className="text-blue-300 hover:text-blue-200">
          hello@theanswerline.kiwi
        </a>
        .
      </p>
    </div>
  );
}

function Field({
  label,
  name,
  type,
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-white/70">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-blue-500 focus:bg-white/10"
      />
    </label>
  );
}
