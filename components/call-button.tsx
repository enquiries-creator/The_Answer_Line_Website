import Link from "next/link";
import { Mic } from "lucide-react";

export default function CallButton({
  caption,
  align = "center",
}: {
  caption?: string;
  align?: "center" | "start";
}) {
  return (
    <div
      className={`flex flex-col gap-3 ${
        align === "start" ? "items-start" : "items-center"
      }`}
    >
      <Link
        href="/#try-it"
        className="group flex items-center gap-4 rounded-full border border-white/15 bg-white/5 py-2 pl-6 pr-2 shadow-[0_0_40px_rgba(37,99,235,0.25)] backdrop-blur transition hover:border-blue-500/60 hover:bg-white/10"
      >
        <span className="text-lg font-medium tracking-wide">Try the agent</span>
        <span className="flex h-11 items-center gap-2 rounded-full bg-blue-600 px-5 text-sm font-semibold text-white transition group-hover:bg-blue-500">
          <Mic className="h-4 w-4" />
          Talk to it now
        </span>
      </Link>
      <p className="text-sm text-white/50">
        {caption ?? "Don’t take our word for it — talk to the demo right on this page. Answers 24/7."}
      </p>
    </div>
  );
}
