import Link from "next/link";
import { AnswerlineHero } from "@/components/ui/hero-landing-page";

const steps = [
  {
    title: "It answers.",
    body: "Every call, first time, day or night. No voicemail, no hold music. Your caller talks to a friendly voice that already knows your business.",
  },
  {
    title: "It captures the details.",
    body: "What they need, where they are, how urgent it is, and the best number to reach them. Burst pipe at 9pm, a quote on Sunday, a booking for next week — all written down properly.",
  },
  {
    title: "It texts you.",
    body: "The full job lands in your pocket seconds after the call ends. You ring back when you’re free — with everything in front of you.",
  },
];

const costs = [
  {
    title: "The one you know about",
    body: "The caller who rang back, annoyed, asking why you never answered. That one stings — but at least you know.",
  },
  {
    title: "The ones you don’t",
    body: "The 9pm emergency that rang someone else. The Sunday booking that went cold. The “just getting quotes” caller who would’ve said yes. They don’t show up anywhere — not in your missed calls, not in your books. Just money that quietly never arrived.",
  },
  {
    title: "The maths that matters",
    body: "One decent job covers The Answer Line for months. If it catches a single call you’d have slept through, it’s paid for itself. Everything after that is profit you didn’t know you were losing.",
  },
];

const honestPoints = [
  "Sounds natural, talks like a normal person, handles back-and-forth — not a “press 1 for…” menu.",
  "Doesn’t pretend to be you. Answers as your business and says it’ll have you call back.",
  "Never guesses prices or makes promises on your behalf. Takes the details, full stop.",
  "If a caller wants a human, no worries — the message still gets to you, marked urgent.",
];

const testimonials = [
  {
    quote: "First week it caught two jobs I’d have slept through. One was a hot-water cylinder — that’s a grand and a half I’d never have known about.",
    name: "Dave K.",
    detail: "Plumber, Henderson",
  },
  {
    quote: "Two bookings came in while I was shooting a wedding. Both would’ve gone to voicemail, and both would’ve gone cold.",
    name: "Priya M.",
    detail: "Photographer, Grey Lynn",
  },
  {
    quote: "I was sceptical as. Talked to the demo to try and trip it up and it handled me better than my old receptionist.",
    name: "Mike T.",
    detail: "Electrician, Papakura",
  },
  {
    quote: "I’m a one-woman cleaning run. It books my Saturdays while I’m still on Friday’s job.",
    name: "Tania W.",
    detail: "Cleaner, Manukau",
  },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <AnswerlineHero />

      {/* What a missed call actually costs */}
      <section className="border-b border-white/10 bg-white/[0.02]">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <h2 className="max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
            What a missed call actually costs
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {costs.map((c) => (
              <div
                key={c.title}
                className="rounded-2xl border border-white/10 bg-[#121417] p-6"
              >
                <h3 className="text-lg font-semibold">{c.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/55">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-24">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-blue-400">
          How it works
        </p>
        <h2 className="mt-3 max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl">
          Three steps. None of them yours.
        </h2>
        <div className="mt-12 grid gap-10 sm:grid-cols-3">
          {steps.map((s, i) => (
            <div key={s.title}>
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-blue-500/40 bg-blue-500/10 text-sm font-semibold text-blue-300">
                {i + 1}
              </div>
              <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/55">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Honesty section */}
      <section className="border-y border-white/10 bg-white/[0.02]">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="grid items-start gap-12 lg:grid-cols-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-blue-400">
                The honest bit
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                Straight up — is this a robot?
              </h2>
              <p className="mt-5 leading-relaxed text-white/60">
                Yeah, it’s clever software, not a person in a call centre.
                We’re not going to pretend otherwise.
              </p>
              <p className="mt-4 leading-relaxed text-white/60">
                Most callers just want to be heard and know someone’s onto it.
                That’s exactly what they get.
              </p>
              <div className="mt-8 rounded-2xl border border-blue-500/30 bg-blue-500/10 p-5 text-sm leading-relaxed text-white/80">
                Still not sure?{" "}
                <Link href="/#try-it" className="font-semibold text-blue-300 hover:text-blue-200">
                  Talk to it at the top of this page
                </Link>{" "}
                and judge it yourself.
              </div>
            </div>
            <ul className="space-y-4">
              {honestPoints.map((p) => (
                <li
                  key={p}
                  className="flex gap-3 rounded-2xl border border-white/10 bg-[#121417] p-5 text-sm leading-relaxed text-white/70"
                >
                  <span className="mt-0.5 text-blue-400">✓</span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Case studies */}
      <section className="mx-auto max-w-6xl px-6 py-24 text-center">
        <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          These problems used to be theirs.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/50">
          Missed emergencies. Bookings gone cold. Bad reviews from callers who
          never got through. Real Auckland businesses — here’s what stopped
          happening the week they switched on.
        </p>
        <div className="mt-12 grid gap-6 text-left sm:grid-cols-2">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="flex flex-col rounded-2xl border border-white/10 bg-[#121417] p-6"
            >
              <div className="text-sm tracking-widest text-amber-400" aria-label="5 out of 5 stars">
                ★★★★★
              </div>
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-white/70">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-5 text-sm">
                <span className="font-semibold">{t.name}</span>
                <span className="text-white/40"> · {t.detail}</span>
              </figcaption>
            </figure>
          ))}
        </div>
        <Link
          href="/case-study"
          className="mt-10 inline-block text-sm font-medium text-blue-300 hover:text-blue-200"
        >
          See the full story: how one business found the jobs it didn’t know it was losing →
        </Link>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden border-t border-white/10 px-6 py-28 text-center">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-blue-600/25 to-transparent"
        />
        <div className="relative z-10 mx-auto max-w-2xl">
          <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-5xl">
            The next missed call is coming. Decide who answers it.
          </h2>
          <p className="mx-auto mt-5 max-w-xl leading-relaxed text-white/60">
            Talk to the agent at the top of the page and have a crack at
            stumping it. If you wouldn’t trust it with your callers, don’t buy
            it. No lock-in contracts, no setup marathon — most businesses are
            live in a couple of days.
          </p>
          <div className="mt-10 flex flex-col items-center gap-5">
            <Link
              href="/#try-it"
              className="rounded-md bg-[#0084ff] px-7 py-3.5 text-base font-medium text-white transition-colors hover:bg-[#0066cc]"
            >
              🎙 Talk to it now
            </Link>
            <p className="text-sm text-white/50">
              <Link href="/contact" className="text-blue-300 hover:text-blue-200">
                Or get your own version built — free →
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
