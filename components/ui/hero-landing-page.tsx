"use client";

import { Mic } from "lucide-react";
import HeroTrial from "@/components/hero-trial";
import HeroCallPlayer from "@/components/hero-call-player";

export function AnswerlineHero() {
  return (
    <section className="relative flex min-h-svh items-center overflow-hidden bg-[#0a0a0a] pb-24 pt-32 sm:pb-28">
      {/* Background photo — tradie with his hands full */}
      <div aria-hidden="true" className="absolute inset-0 z-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero-tradie.jpg"
          alt=""
          className="h-full w-full object-cover object-[70%_center] opacity-45"
        />
        {/* readability + brand atmosphere over the photo */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/80 to-[#0a0a0a]/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c0e] via-transparent to-[#0a0a0a]/60" />
        <div className="hero-blob absolute -left-[15%] top-[5%] h-[70vh] w-[70vh] rounded-full bg-[#0084ff]/20 blur-[120px]" />
        <div className="hero-blob-slow absolute right-[-10%] top-[30%] h-[60vh] w-[60vh] rounded-full bg-[#0055cc]/15 blur-[130px]" />
      </div>

      <div className="relative z-[2] mx-auto flex w-full max-w-[1400px] flex-col items-center justify-between gap-16 px-6 sm:px-12 lg:flex-row lg:items-center lg:gap-10">
        {/* Left: headline + CTA + call player */}
        <div className="max-w-[720px]">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/30 px-4 py-1.5 text-xs font-medium text-white/70 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Auckland-made · Answers in 3 rings
          </span>
          <h1 className="mt-7 text-5xl font-light leading-[1.08] tracking-[-2px] sm:text-6xl lg:text-[72px]">
            That missed call
            <br />
            just cost you a job.
          </h1>
          <p className="mt-7 max-w-xl text-base leading-relaxed text-[#b8b8b8] sm:text-lg">
            86% of callers won&rsquo;t leave a voicemail. They ring the next name
            on the list. The Answer Line picks up every call, gets the
            details, and texts the job straight to you.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <button
              onClick={() => window.dispatchEvent(new Event("al:try"))}
              className="flex items-center gap-2.5 rounded-md bg-[#0084ff] px-7 py-3.5 text-base font-medium text-white transition-all duration-200 hover:translate-x-0.5 hover:bg-[#0066cc]"
            >
              <Mic className="h-5 w-5" />
              Talk to it right now
            </button>
            <p className="text-sm text-white/40">
              Right here on this page — nothing to install.
            </p>
          </div>

          {/* Real recorded call: play button + reactive bars; transcript fades into the hero */}
          <HeroCallPlayer />
        </div>

        {/* Right: the live trial */}
        <HeroTrial />
      </div>
    </section>
  );
}
