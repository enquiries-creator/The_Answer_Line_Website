import Link from "next/link";
import Image from "next/image";
import { DEMO_NUMBER, DEMO_TEL } from "@/components/call-button";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="max-w-xs">
          <Image
            src="/logo-horizontal-white.png"
            alt="Answerline"
            width={596}
            height={90}
            className="h-6 w-auto"
          />
          <p className="mt-4 text-sm leading-relaxed text-white/50">
            Your phone, answered — every call, day or night. Job details texted
            straight to you, so the work you’ve earned actually reaches you.
          </p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-white/40">Pages</p>
          <ul className="mt-4 space-y-2.5 text-sm text-white/60">
            <li><Link href="/" className="hover:text-white">Home</Link></li>
            <li><Link href="/case-study" className="hover:text-white">Case study</Link></li>
            <li><Link href="/about" className="hover:text-white">About</Link></li>
            <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-white/40">Try it</p>
          <ul className="mt-4 space-y-2.5 text-sm text-white/60">
            <li>
              <a href={`tel:${DEMO_TEL}`} className="hover:text-white">
                Demo line: {DEMO_NUMBER}
              </a>
            </li>
            <li>
              <a href="mailto:hello@theanswerline.kiwi" className="hover:text-white">
                hello@theanswerline.kiwi
              </a>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-white/40">The honest bit</p>
          <p className="mt-4 text-sm leading-relaxed text-white/50">
            Auckland-based, run by a real person you can ring. No lock-in
            contracts, no hard sell.
          </p>
        </div>
      </div>
      <div className="border-t border-white/10 py-6 text-center text-xs text-white/40">
        © 2026 The Answer Line · Auckland, New Zealand
      </div>
    </footer>
  );
}
