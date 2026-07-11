"use client";

import { useState } from "react";

export default function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <div className="mx-auto max-w-xl px-6 pb-24 pt-40">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-blue-400">
        Contact
      </p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
        Get your free demo
      </h1>
      <p className="mt-5 leading-relaxed text-white/60">
        Leave your details and we’ll set up a demo line that answers like{" "}
        <em>your</em> business — your trade, your service area, your callers.
        Ring it, try to trip it up, and see what your customers would hear.
        Takes us a day or so to set up. Costs you nothing to try.
      </p>

      {sent ? (
        <div className="mt-10 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 leading-relaxed text-white/80">
          Got it — cheers. We’ll be in touch within a day to get your demo
          sorted. If it’s urgent, ring us on the demo line and leave your name.
        </div>
      ) : (
        <form
          className="mt-10 space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
        >
          <Field label="Name" name="name" type="text" required placeholder="Dave Smith" />
          <Field label="Email" name="email" type="email" required placeholder="dave@smithplumbing.co.nz" />
          <Field label="Mobile" name="mobile" type="tel" required placeholder="027 123 4567" />
          <Field label="What’s your trade? (optional)" name="trade" type="text" placeholder="Plumber, sparky, builder…" />
          <button
            type="submit"
            className="w-full rounded-full bg-blue-600 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            Set up my free demo
          </button>
        </form>
      )}

      <p className="mt-8 text-center text-sm leading-relaxed text-white/45">
        Auckland-based, run by a real person you can ring. No lock-in
        contracts, no hard sell — if it’s not for you, no hard feelings.
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
