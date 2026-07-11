import Link from "next/link";
import CallButton, { DEMO_NUMBER, DEMO_TEL } from "@/components/call-button";
import { AnswerlineHero } from "@/components/ui/hero-landing-page";

const steps = [
  {
    title: "It answers.",
    body: "Every call, first time, day or night. No voicemail, no hold music. Your caller talks to a friendly voice that knows your business.",
  },
  {
    title: "It captures the job.",
    body: "What’s wrong, where they are, how urgent it is, and the best number to get them on. Burst pipe at 9pm or a fence quote on Sunday — it’s all written down properly.",
  },
  {
    title: "It texts you.",
    body: "The full job lands in your pocket seconds after the call ends. You ring back when you’re off the roof — with everything you need already in front of you.",
  },
];

const benefits = [
  {
    title: "Stop losing after-hours work",
    body: "Most callers won’t leave a voicemail. They hang up and ring the next tradie on the list. The 7am “before work” callers and the 9pm “pipe’s burst” callers all get answered — and the job stays yours.",
  },
  {
    title: "Keep your hands on the tools",
    body: "You can’t quote a deck and answer the phone at the same time. Stop climbing down the ladder for “how much for a powerpoint?” Every call gets handled, and you deal with the good ones on your smoko, not mid-cut.",
  },
  {
    title: "Sound like a proper outfit",
    body: "When someone rings a business and a real conversation happens — not a beep — they trust it. Callers get answered like you’ve got someone in the office, even when the office is your ute.",
  },
];

const honestPoints = [
  "It sounds natural, talks like a normal person, and handles back-and-forth — not a “press 1 for…” menu.",
  "It doesn’t pretend to be you. It answers as your business and says it’ll have you call back.",
  "It never guesses prices or makes promises on your behalf. It takes the job details, full stop.",
  "If a caller wants a human, no worries — the message still gets to you, marked urgent.",
];

const testimonials = [
  {
    quote: "First week it caught two jobs I’d have slept through. One was a hot-water cylinder — that’s a grand and a half I’d never have known about.",
    name: "Dave K.",
    detail: "Plumber, Henderson",
  },
  {
    quote: "I was sceptical as. Rang the demo line to try and trip it up and it handled me better than my old receptionist.",
    name: "Mike T.",
    detail: "Electrician, Papakura",
  },
  {
    quote: "Customers keep telling me the “girl in the office” was lovely. There is no office. It’s my ute.",
    name: "Shaun R.",
    detail: "Builder, Glenfield",
  },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <AnswerlineHero />

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

      {/* Benefits */}
      <section className="border-y border-white/10 bg-white/[0.02]">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <h2 className="max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
            The calls you’re missing are the ones that pay.
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="rounded-2xl border border-white/10 bg-[#121417] p-6"
              >
                <h3 className="text-lg font-semibold">{b.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/55">{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Honesty section */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid items-start gap-12 lg:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-blue-400">
              The honest bit
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Straight up — is this a robot?
            </h2>
            <p className="mt-5 leading-relaxed text-white/60">
              Yeah, it’s clever software, not a person in a call centre. We’re
              not going to pretend otherwise.
            </p>
            <p className="mt-4 leading-relaxed text-white/60">
              Most callers just want to be heard and know someone’s onto it.
              That’s exactly what they get.
            </p>
            <div className="mt-8 rounded-2xl border border-blue-500/30 bg-blue-500/10 p-5 text-sm leading-relaxed text-white/80">
              Still not sure? Ring the demo line and judge it yourself:{" "}
              <a href={`tel:${DEMO_TEL}`} className="font-semibold text-blue-300 hover:text-blue-200">
                {DEMO_NUMBER}
              </a>
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
      </section>

      {/* Testimonials */}
      <section className="border-y border-white/10 bg-white/[0.02]">
        <div className="mx-auto max-w-6xl px-6 py-24 text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Tradies who stopped missing calls
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-white/50">
            Real Auckland trade and service businesses. Real jobs that used to
            go to voicemail.
          </p>
          <div className="mt-12 grid gap-6 text-left sm:grid-cols-3">
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
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden px-6 py-28 text-center">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-blue-600/25 to-transparent"
        />
        <div className="relative z-10 mx-auto max-w-2xl">
          <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-5xl">
            Hear it before you pay a cent.
          </h2>
          <p className="mx-auto mt-5 max-w-xl leading-relaxed text-white/60">
            Ring the demo line and have a crack at stumping it. If you wouldn’t
            trust it with your callers, don’t buy it. No lock-in contracts, no
            setup marathon — most trades are live in a couple of days.
          </p>
          <div className="mt-10">
            <CallButton caption="Or get a demo set up for your own business — free." />
          </div>
          <Link
            href="/contact"
            className="mt-6 inline-block text-sm font-medium text-blue-300 hover:text-blue-200"
          >
            Set up my free demo →
          </Link>
        </div>
      </section>
    </>
  );
}
