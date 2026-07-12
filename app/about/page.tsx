import type { Metadata } from "next";
import CallButton from "@/components/call-button";

export const metadata: Metadata = {
  title: "About — The Answer Line",
  description:
    "Why The Answer Line exists: too many good trades losing work to voicemail. Auckland-based, run by a real person.",
};

export default function About() {
  return (
    <div className="mx-auto max-w-3xl px-6 pb-24 pt-40">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-blue-400">
        About
      </p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
        Why this exists
      </h1>
      <div className="mt-8 space-y-5 text-lg leading-relaxed text-white/70">
        <p>The Answer Line is run out of Auckland by Kieran.</p>
        <p>
          It started with a simple observation: good tradies lose work every
          week — not because they’re not good, but because they physically
          can’t answer the phone while doing the job. The caller doesn’t wait.
          They ring the next number, and that’s that.
        </p>
        <p>
          Big firms fixed this years ago with receptionists and call centres. A
          one-or-two-person trade business can’t carry that cost. So the
          after-hours and on-the-tools calls just… leak.
        </p>
        <p>
          The Answer Line plugs the leak. Nothing flash — your phone just gets
          answered, every time, and the job details land in your pocket.
        </p>
        <p>
          If you want to talk to the human behind it, email{" "}
          <a
            href="mailto:hello@theanswerline.kiwi"
            className="text-blue-300 hover:text-blue-200"
          >
            hello@theanswerline.kiwi
          </a>
          . You’ll get me, not a ticket number.
        </p>
      </div>
      <div className="mt-14">
        <CallButton caption="Talk to the demo — see what your callers would get." />
      </div>
    </div>
  );
}
