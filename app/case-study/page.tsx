import type { Metadata } from "next";
import CallButton from "@/components/call-button";

export const metadata: Metadata = {
  title: "Case study — The Answer Line",
  description:
    "How a Henderson plumber stopped losing jobs to voicemail with The Answer Line.",
};

const stats = [
  { value: "9", label: "jobs booked from calls that would’ve gone to voicemail" },
  { value: "$14,300", label: "of work he’d likely never have known about" },
  { value: "4 hrs", label: "a week back — no more phone-tag and callbacks" },
];

export default function CaseStudy() {
  return (
    <article className="mx-auto max-w-3xl px-6 pb-24 pt-40">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-blue-400">
        Case study
      </p>
      <h1 className="mt-3 text-balance text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
        “I was losing jobs I never even knew about.”
      </h1>
      <p className="mt-5 text-lg text-white/60">
        How Dave, a Henderson plumber, got his missed calls answering themselves.
      </p>

      <h2 className="mt-14 text-2xl font-semibold tracking-tight">Before</h2>
      <div className="mt-4 space-y-4 leading-relaxed text-white/70">
        <p>
          Dave runs a two-man plumbing outfit in Henderson. Like most sole
          traders, his booking system was his own mobile — answered from under
          sinks, on roofs, and never after knock-off.
        </p>
        <p>
          The maths was rough. He was missing around 11 calls a week. Most never
          left a voicemail. They just rang the next plumber on Google.
        </p>
      </div>
      <blockquote className="mt-8 border-l-2 border-blue-500 pl-5 text-lg italic leading-relaxed text-white/80">
        “You’d see three missed calls at 5pm and just know two of them had
        already booked someone else.”
      </blockquote>

      <h2 className="mt-14 text-2xl font-semibold tracking-tight">After</h2>
      <p className="mt-4 leading-relaxed text-white/70">
        He put The Answer Line on his number. Now when he can’t pick up, it does
        — sounds sharp, gets the job details, texts him straight away. In the
        first six weeks:
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-white/10 bg-[#121417] p-5"
          >
            <p className="text-3xl font-semibold tracking-tight text-blue-300">
              {s.value}
            </p>
            <p className="mt-2 text-sm leading-snug text-white/55">{s.label}</p>
          </div>
        ))}
      </div>
      <blockquote className="mt-10 border-l-2 border-blue-500 pl-5 text-lg italic leading-relaxed text-white/80">
        “The burst hot-water cylinder on a Sunday paid for the year on its own.”
      </blockquote>

      <h2 className="mt-14 text-2xl font-semibold tracking-tight">
        The bit that surprised him
      </h2>
      <p className="mt-4 leading-relaxed text-white/70">
        His customers started complimenting the “new receptionist.” A couple of
        regulars asked if business was going well since he’d “taken someone on.”
        Nobody guessed — and the ones he told didn’t care. Their call got
        answered and the job got done.
      </p>

      <div className="mt-16 rounded-3xl border border-white/10 bg-white/[0.03] p-10 text-center">
        <p className="text-xl font-semibold tracking-tight">
          Same phone. Same number. It just answers now.
        </p>
        <div className="mt-8">
          <CallButton caption="Hear exactly what Dave’s callers hear." />
        </div>
      </div>
    </article>
  );
}
