import Link from "next/link";
import Image from "next/image";

const links = [
  { href: "/#how-it-works", label: "How it works" },
  { href: "/case-study", label: "Case study" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
      <nav className="flex w-full max-w-4xl items-center justify-between gap-4 rounded-full border border-white/10 bg-black/70 py-2 pl-5 pr-2 backdrop-blur-md">
        <Link href="/" className="flex items-center py-1" aria-label="Answerline — home">
          <Image
            src="/logo-horizontal-white.png"
            alt="Answerline"
            width={596}
            height={90}
            priority
            className="h-6 w-auto"
          />
        </Link>
        <div className="hidden items-center gap-6 text-sm text-white/70 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="transition hover:text-white">
              {l.label}
            </Link>
          ))}
        </div>
        <Link
          href="/contact"
          className="whitespace-nowrap rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
        >
          Get a free demo
        </Link>
      </nav>
    </header>
  );
}

export function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.61 21 3 13.39 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.24.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2Z" />
    </svg>
  );
}
