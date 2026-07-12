"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

type Line = {
  t: number; // seconds into the snippet when this line starts
  role: "caller" | "agent";
  text: string;
  badge?: string; // response-time callout, only on genuinely fast agent turns
};

const LINES: Line[] = [
  { t: 0.4, role: "caller", text: "Yeah." },
  {
    t: 1.4,
    role: "agent",
    text: "Got it. Just one last thing — is the water still running, or have you been able to shut it off at the toby?",
    badge: "replied in 1.0s",
  },
  {
    t: 8.5,
    role: "caller",
    text: "What? Um, no… Toby hasn't been home in a little while. How do you know Toby?",
  },
  {
    t: 15.5,
    role: "agent",
    text: "Ah, no — the toby is just the main water shut-off valve out by your front boundary, not a person. No worries if you can't find it though. So — overflowing sewage at 28 Watson Street, New Lynn, doing damage now, and Dave's calling you back on the number we've confirmed. That all correct?",
  },
  { t: 35.5, role: "caller", text: "Yeah… bring some gloves though, yeah?" },
  { t: 39.3, role: "agent", text: "Will do, I'll make sure.", badge: "replied in 1.2s" },
  {
    t: 42.5,
    role: "agent",
    text: "Dave gets this by text right now, marked urgent. Thanks for calling, and have a good night.",
  },
];

const BAR_COUNT = 5;

export default function HeroCallPlayer() {
  const ctxRef = useRef<AudioContext | null>(null);
  const bufferRef = useRef<AudioBuffer | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const startedAtRef = useRef(0); // ctx.currentTime when playback (re)started
  const offsetRef = useRef(0); // seconds into the snippet when paused
  const rafRef = useRef<number>(0);
  const barRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [time, setTime] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!playing) {
      cancelAnimationFrame(rafRef.current);
      return;
    }
    const data = analyserRef.current
      ? new Uint8Array(analyserRef.current.frequencyBinCount)
      : null;
    const tick = () => {
      const ctx = ctxRef.current;
      if (ctx) setTime(ctx.currentTime - startedAtRef.current + offsetRef.current);
      if (analyserRef.current && data) {
        analyserRef.current.getByteFrequencyData(data);
        for (let i = 0; i < BAR_COUNT; i++) {
          const el = barRefs.current[i];
          if (!el) continue;
          const v = data[2 + i * 3] / 255;
          el.style.transform = `scaleY(${0.25 + v * 0.75})`;
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [playing]);

  const stopSource = () => {
    try {
      sourceRef.current?.stop();
    } catch {}
    sourceRef.current = null;
  };

  const playFrom = (offset: number) => {
    const ctx = ctxRef.current;
    const buf = bufferRef.current;
    if (!ctx || !buf) return;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    if (!analyserRef.current) {
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      analyser.smoothingTimeConstant = 0.75;
      analyser.connect(ctx.destination);
      analyserRef.current = analyser;
    }
    src.connect(analyserRef.current);
    src.onended = () => {
      // natural end of the snippet (not a manual stop)
      if (sourceRef.current === src) {
        setPlaying(false);
        offsetRef.current = 0;
        setTime(buf.duration);
      }
    };
    offsetRef.current = offset;
    startedAtRef.current = ctx.currentTime;
    src.start(0, offset);
    sourceRef.current = src;
    setPlaying(true);
    setStarted(true);
  };

  const toggle = async () => {
    if (loading) return;
    if (playing) {
      const ctx = ctxRef.current;
      if (ctx) offsetRef.current += ctx.currentTime - startedAtRef.current;
      stopSource();
      setPlaying(false);
      return;
    }
    try {
      if (!ctxRef.current) {
        const Ctx =
          window.AudioContext ??
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;
        ctxRef.current = new Ctx();
      }
      await ctxRef.current.resume();
      if (!bufferRef.current) {
        setLoading(true);
        const res = await fetch("/dave-best-call.mp3");
        const raw = await res.arrayBuffer();
        bufferRef.current = await ctxRef.current.decodeAudioData(raw);
        setLoading(false);
      }
      const buf = bufferRef.current;
      const from = offsetRef.current >= buf.duration - 0.25 ? 0 : offsetRef.current;
      if (from === 0) setTime(0);
      playFrom(from);
    } catch {
      setLoading(false);
    }
  };

  const visible = LINES.filter((l) => started && time >= l.t);

  return (
    <>
      {/* Player control — sits in the hero's left column */}
      <div className="mt-8 flex items-center gap-4">
        <button
          onClick={toggle}
          aria-label={playing ? "Pause the recorded call" : "Play a real recorded call"}
          className="group flex items-center gap-3 rounded-full border border-white/15 bg-black/40 py-2 pl-2 pr-5 backdrop-blur transition-colors hover:border-white/30"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0084ff] transition-colors group-hover:bg-[#0066cc]">
            {playing ? (
              <Pause className="h-4 w-4 text-white" />
            ) : (
              <Play className="ml-0.5 h-4 w-4 text-white" />
            )}
          </span>
          {/* audio-reactive bars */}
          <span className="flex h-6 items-center gap-[3px]" aria-hidden="true">
            {Array.from({ length: BAR_COUNT }).map((_, i) => (
              <span
                key={i}
                ref={(el) => {
                  barRefs.current[i] = el;
                }}
                className={`w-[3px] origin-center rounded-full bg-blue-400 transition-transform ${
                  playing ? "" : "!scale-y-[0.25]"
                }`}
                style={{ height: `${12 + (i % 3) * 5}px`, transform: "scaleY(0.25)" }}
              />
            ))}
          </span>
          <span className="text-sm font-medium text-white/90">
            {loading
              ? "Loading the call…"
              : playing
                ? "Playing — a real recorded call"
                : "Hear it handle a real call"}
          </span>
        </button>
      </div>
      <p className="mt-2.5 text-xs text-white/40">
        Recorded on the demo line, unedited. Watch how fast it comes back.
      </p>

      {/* Transcript — fades into the hero background as the call plays */}
      <div
        aria-live="polite"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] hidden justify-center pb-6 lg:flex"
      >
        <div className="flex w-full max-w-[1400px] justify-start px-6 sm:px-12">
          <div className="flex max-w-md flex-col gap-2">
            {visible.slice(-4).map((l, idx, arr) => {
              const isLast = idx === arr.length - 1;
              return (
                <div
                  key={l.t}
                  className={`animate-[fadeInUp_0.5s_ease] transition-opacity duration-700 ${
                    isLast ? "opacity-100" : "opacity-40"
                  }`}
                >
                  <div
                    className={`inline-block rounded-2xl px-4 py-2.5 text-sm leading-relaxed backdrop-blur ${
                      l.role === "agent"
                        ? "border border-blue-400/30 bg-blue-500/15 text-white/90"
                        : "border border-white/10 bg-black/40 text-white/60"
                    }`}
                  >
                    {l.badge && (
                      <span className="mb-1 mr-2 inline-flex items-center gap-1.5 rounded-full bg-[#0084ff] px-2.5 py-0.5 text-[11px] font-semibold text-white">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                        {l.badge}
                      </span>
                    )}
                    {l.text}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
