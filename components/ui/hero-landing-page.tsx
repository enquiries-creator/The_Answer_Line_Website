"use client";

import { Mic } from "lucide-react";
import HeroTrial from "@/components/hero-trial";

export function AnswerlineHero({ videoSrc }: { videoSrc?: string }) {
  return (
    <section className="relative flex min-h-svh items-center overflow-hidden bg-[#0a0a0a] pb-16 pt-32 sm:pb-20">
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

      <div className="relative z-[2] mx-auto flex w-full max-w-[1400px] flex-col items-center justify-between gap-16 px-6 sm:px-12 lg:flex-row lg:items-center lg:gap-10">
        {/* Left: headline + CTA */}
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
          </div>
          <p className="mt-3 text-sm text-white/40">
            Right here on this page — nothing to install, no number to ring.
          </p>
        </div>

        {/* Right: the live trial */}
        <HeroTrial />
      </div>
    </section>
  );
}
