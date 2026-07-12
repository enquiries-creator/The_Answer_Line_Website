"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Mic, PhoneOff } from "lucide-react";
import { ConversationProvider, useConversation } from "@elevenlabs/react";

type Phase = "idle" | "form" | "connecting" | "live" | "ended" | "done";

export default function HeroTrial() {
  return (
    <ConversationProvider>
      <HeroTrialInner />
    </ConversationProvider>
  );
}

function HeroTrialInner() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [error, setError] = useState<string | null>(null);
  const [lead, setLead] = useState({ name: "", email: "", phone: "" });
  const [followUp, setFollowUp] = useState({ website: "", notes: "" });
  const [maxSeconds, setMaxSeconds] = useState(120);
  const [secondsLeft, setSecondsLeft] = useState(120);
  const [hadFreeGo, setHadFreeGo] = useState(false);
  const [busy, setBusy] = useState(false);
  const orbRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<() => void>(() => {});

  const conversation = useConversation({
    onConnect: () => setPhase("live"),
    onDisconnect: () => setPhase((p) => (p === "live" ? "ended" : p)),
    onError: () => {
      setError("The call dropped — give it another go.");
      setPhase((p) => (p === "live" || p === "connecting" ? "ended" : p));
    },
  });
  const { status, isSpeaking } = conversation;
  endRef.current = () => conversation.endSession();

  // Voice-reactive glow: feed the agent's output volume into a CSS variable.
  useEffect(() => {
    if (phase !== "live") {
      orbRef.current?.style.setProperty("--level", "0");
      return;
    }
    let raf = 0;
    const tick = () => {
      const v = conversation.getOutputVolume?.() ?? 0;
      orbRef.current?.style.setProperty("--level", String(Math.min(1, v * 1.8)));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase, conversation]);

  // Countdown; the free go is client-ended, longer goes the agent caps itself.
  useEffect(() => {
    if (phase !== "live") return;
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(id);
          endRef.current();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [phase]);

  // Lets the headline CTA start the trial from anywhere on the page.
  useEffect(() => {
    const open = () => {
      wrapRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
      document.getElementById("try-it-cta")?.click();
    };
    window.addEventListener("al:try", open);
    return () => window.removeEventListener("al:try", open);
  }, []);

  async function requestCall(kind: "open-trial" | "trial", extra: Record<string, string> = {}) {
    setError(null);
    setPhase("connecting");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, ...extra }),
      });
      const data = await res.json();
      if (data.gate) {
        // Free taste used — swap to the details form for another go.
        setHadFreeGo(true);
        setPhase("form");
        return;
      }
      if (!res.ok) throw new Error(data.error || "Something went wrong — try again.");
      if (!data.token) throw new Error("Couldn't start the call — try again in a minute.");
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch {
        throw new Error(
          "The call needs your mic. Allow microphone access in your browser and try again."
        );
      }
      const cap = data.maxSeconds || 120;
      setMaxSeconds(cap);
      setSecondsLeft(cap);
      await conversation.startSession({ conversationToken: data.token });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong — try again.");
      setPhase(kind === "trial" ? "form" : "idle");
    }
  }

  async function startGatedCall(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const hp = (new FormData(e.currentTarget).get("company") as string) || "";
    await requestCall("trial", { ...lead, company: hp });
  }

  async function sendFollowUp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const hp = (new FormData(e.currentTarget).get("company") as string) || "";
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "callback", ...lead, ...followUp, company: hp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "That didn't send — give it another go.");
      setPhase("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "That didn't send — give it another go.");
    } finally {
      setBusy(false);
    }
  }

  const talking = status === "connected" && isSpeaking;
  const mins = Math.floor(secondsLeft / 60);
  const secs = String(secondsLeft % 60).padStart(2, "0");

  const inputCls =
    "w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-[#0084ff]";

  return (
    <div ref={wrapRef} id="try-it" className="flex w-full max-w-md scroll-mt-28 flex-col items-center">
      {/* The orb */}
      <div
        ref={orbRef}
        className={`orb relative h-60 w-60 sm:h-72 sm:w-72 ${phase === "live" ? "" : "orb-idle"}`}
      >
        <div className="orb-glow pointer-events-none absolute -inset-8 rounded-full bg-[#0084ff]/30 blur-2xl" />
        <div className="orb-glow pointer-events-none absolute -inset-14 rounded-full bg-[#0055cc]/20 blur-3xl" />
        <div
          className="orb-spin pointer-events-none absolute -inset-1 rounded-full"
          style={{
            background:
              "conic-gradient(from 0deg, rgba(0,132,255,0) 0%, rgba(0,132,255,0.9) 18%, rgba(125,211,252,0.7) 28%, rgba(0,132,255,0) 45%)",
          }}
        />
        <div className="orb-ring pointer-events-none absolute -inset-3 rounded-full border-2 border-[#0084ff]/50" />
        <div className="absolute inset-0 overflow-hidden rounded-full border border-white/20 bg-[#121417]">
          <Image
            src="/agent.jpg"
            alt="The Answer Line demo agent"
            fill
            sizes="288px"
            className="object-cover object-top"
            priority
          />
        </div>
        {/* Status chip */}
        <div className="absolute -bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full border border-white/15 bg-black/70 px-4 py-1.5 text-xs font-medium text-white/85 backdrop-blur">
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              phase === "live"
                ? talking
                  ? "bg-[#0084ff] animate-pulse"
                  : "bg-emerald-400 animate-pulse"
                : "bg-emerald-400"
            }`}
          />
          {phase === "live"
            ? talking
              ? "Talking…"
              : "Listening — go on, say something"
            : phase === "connecting"
              ? "Connecting…"
              : "Live demo · answers 24/7"}
        </div>
      </div>

      {/* Under the orb */}
      <div className="mt-9 w-full">
        {phase === "idle" && (
          <div className="flex flex-col items-center text-center">
            <button
              id="try-it-cta"
              onClick={() => requestCall("open-trial")}
              className="flex items-center gap-2.5 rounded-full bg-[#0084ff] px-8 py-4 text-base font-semibold text-white shadow-[0_0_50px_rgba(0,132,255,0.45)] transition-all duration-200 hover:scale-[1.03] hover:bg-[#0066cc]"
            >
              <Mic className="h-5 w-5" />
              Talk to the agent
            </button>
            <p className="mt-3 text-xs font-medium text-white/45">
              Free go · no sign-up · starts straight away
            </p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/55">
              This is the simulated after-hours line for{" "}
              <span className="text-white/80">Dave&rsquo;s Plumbing</span> — a made-up
              Henderson plumber. Say what you&rsquo;d say ringing a real one, and try to
              trip it up.
            </p>
            {error && <p className="mt-3 text-xs leading-relaxed text-red-400">{error}</p>}
          </div>
        )}

        {phase === "form" && (
          <form onSubmit={startGatedCall} className="rounded-2xl border border-white/15 bg-black/50 p-5 backdrop-blur">
            <p className="text-sm font-semibold text-white">
              {hadFreeGo ? "Keen for another go?" : "Quick one before it picks up"}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-white/50">
              Chuck your details in and you&rsquo;ll get more time with it — and we&rsquo;ll
              send you your own free version to keep.
            </p>
            <div className="mt-4 space-y-3">
              <input
                type="text"
                required
                minLength={2}
                placeholder="Your name"
                value={lead.name}
                onChange={(e) => setLead({ ...lead, name: e.target.value })}
                className={inputCls}
              />
              <input
                type="email"
                required
                placeholder="Email"
                value={lead.email}
                onChange={(e) => setLead({ ...lead, email: e.target.value })}
                className={inputCls}
              />
              <input
                type="tel"
                required
                placeholder="Mobile (e.g. 027 123 4567)"
                value={lead.phone}
                onChange={(e) => setLead({ ...lead, phone: e.target.value })}
                className={inputCls}
              />
              <input
                type="text"
                name="company"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="hidden"
              />
            </div>
            {error && <p className="mt-3 text-xs leading-relaxed text-red-400">{error}</p>}
            <button
              type="submit"
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#0084ff] py-3.5 text-sm font-semibold text-white transition hover:bg-[#0066cc]"
            >
              <Mic className="h-4 w-4" />
              Start the call
            </button>
            <p className="mt-3 text-center text-[11px] leading-relaxed text-white/40">
              Uses your mic, right in the browser. Your details stay with us — no spam.
            </p>
          </form>
        )}

        {phase === "connecting" && (
          <p className="text-center text-sm text-white/60">Ringing… get ready to say g&rsquo;day.</p>
        )}

        {phase === "live" && (
          <div className="flex flex-col items-center gap-4">
            <p className="text-sm tabular-nums text-white/50">
              {mins}:{secs} left on the demo
            </p>
            <button
              onClick={() => conversation.endSession()}
              className="flex items-center gap-2 rounded-full border border-red-500/40 bg-red-500/15 px-6 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-500/25"
            >
              <PhoneOff className="h-4 w-4" />
              Hang up
            </button>
          </div>
        )}

        {phase === "ended" && (
          <form onSubmit={sendFollowUp} className="rounded-2xl border border-[#0084ff]/40 bg-[#0084ff]/10 p-5 backdrop-blur">
            <p className="text-base font-semibold text-white">
              Want that answering <em>your</em> phone?
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-white/65">
              We&rsquo;ll build you your own version — free — set up for your business, plus
              a quick quote. Nothing to pay to hear it.
            </p>
            <div className="mt-4 space-y-3">
              <input
                type="text"
                required
                minLength={2}
                placeholder="Your name"
                value={lead.name}
                onChange={(e) => setLead({ ...lead, name: e.target.value })}
                className={inputCls}
              />
              <input
                type="email"
                required
                placeholder="Email"
                value={lead.email}
                onChange={(e) => setLead({ ...lead, email: e.target.value })}
                className={inputCls}
              />
              <input
                type="tel"
                required
                placeholder="Mobile"
                value={lead.phone}
                onChange={(e) => setLead({ ...lead, phone: e.target.value })}
                className={inputCls}
              />
              <input
                type="text"
                placeholder="Your website (if you've got one)"
                value={followUp.website}
                onChange={(e) => setFollowUp({ ...followUp, website: e.target.value })}
                className={inputCls}
              />
              <textarea
                rows={3}
                placeholder="Anything it'd need to know that's not on your website? e.g. no payments over the phone — just capture the job and I ring back · what counts as an emergency · service area"
                value={followUp.notes}
                onChange={(e) => setFollowUp({ ...followUp, notes: e.target.value })}
                className={`${inputCls} leading-relaxed`}
              />
              <input
                type="text"
                name="company"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="hidden"
              />
            </div>
            {error && <p className="mt-3 text-xs text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={busy}
              className="mt-4 w-full rounded-full bg-[#0084ff] py-3.5 text-sm font-semibold text-white transition hover:bg-[#0066cc] disabled:opacity-60"
            >
              {busy ? "Sending…" : "Build mine — free"}
            </button>
            <div className="mt-2 flex justify-center gap-5 text-xs">
              <button
                type="button"
                onClick={() => requestCall("open-trial")}
                className="py-1 text-white/40 transition hover:text-white/70"
              >
                One more go
              </button>
              <button
                type="button"
                onClick={() => setPhase("idle")}
                className="py-1 text-white/40 transition hover:text-white/70"
              >
                Nah, just looking
              </button>
            </div>
          </form>
        )}

        {phase === "done" && (
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-center">
            <p className="text-base font-semibold text-white">Done — it&rsquo;s underway.</p>
            <p className="mt-2 text-sm leading-relaxed text-white/65">
              Your own version and a quick quote will land in your inbox at{" "}
              <span className="text-white/90">{lead.email || "your email"}</span>, usually
              within a day.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
