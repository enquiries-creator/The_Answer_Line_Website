"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import CallButton from "@/components/call-button";

const stats = [
  { value: "24/7", label: "Every call answered" },
  { value: "3 rings", label: "Average time to pick up" },
];

export function AnswerlineHero({ videoSrc }: { videoSrc?: string }) {
  return (
    <section className="relative flex min-h-svh items-end overflow-hidden bg-[#0a0a0a] pb-16 pt-40 sm:pb-20">
      {/* Background: video if provided, otherwise animated blue atmosphere */}
      {videoSrc ? (
        <video
          className="absolute -top-[10%] left-0 z-0 h-[120%] w-full bg-[#111] object-cover"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      ) : (
        <div aria-hidden="true" className="absolute inset-0 z-0">
          <div className="hero-blob absolute -left-[15%] top-[5%] h-[70vh] w-[70vh] rounded-full bg-[#0084ff]/25 blur-[120px]" />
          <div className="hero-blob-slow absolute right-[-10%] top-[30%] h-[60vh] w-[60vh] rounded-full bg-[#0055cc]/20 blur-[130px]" />
          <div className="hero-blob absolute bottom-[-30%] left-[30%] h-[65vh] w-[65vh] rounded-full bg-[#003a99]/30 blur-[140px]" />
        </div>
      )}

      {/* Gradient overlays from the source component */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[1]">
        <div className="absolute inset-0 bg-gradient-to-r from-[rgba(0,132,255,0.15)] via-transparent to-transparent opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-bl from-[rgba(0,132,255,0.1)] via-transparent to-transparent opacity-50" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0b0c0e] to-transparent" />
      </div>

      <div className="relative z-[2] mx-auto flex w-full max-w-[1400px] flex-col items-start justify-between gap-14 px-6 sm:px-12 lg:flex-row lg:items-end lg:gap-8">
        {/* Left: headline + CTA */}
        <div className="max-w-[800px]">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/30 px-4 py-1.5 text-xs font-medium text-white/70 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Auckland-made · Answers in 3 rings
          </span>
          <h1 className="mt-7 text-5xl font-light leading-[1.08] tracking-[-2px] sm:text-6xl lg:text-[76px]">
            The call you miss
            <br />
            is the job you lose.
          </h1>
          <p className="mt-7 max-w-xl text-base leading-relaxed text-[#b8b8b8] sm:text-lg">
            You’re under a house or up a ladder. Your phone rings, goes to
            voicemail, and a $2,000 job books in with the next bloke. The
            Answer Line picks up, gets the details, texts you the job.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <CallButton align="start" />
            <Link
              href="/#how-it-works"
              className="flex items-center gap-2 py-3 text-base font-medium text-[#b8b8b8] transition-colors duration-200 hover:text-white"
            >
              How it works
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>

        {/* Right: stats */}
        <div className="flex items-end gap-12 lg:gap-20">
          {stats.map((s) => (
            <div key={s.value} className="text-left lg:text-center">
              <div className="text-5xl font-light leading-none sm:text-[64px]">{s.value}</div>
              <div className="mt-3 text-base font-normal text-[#b8b8b8]">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
