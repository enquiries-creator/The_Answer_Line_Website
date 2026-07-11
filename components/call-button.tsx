import { PhoneIcon } from "@/components/nav";

export const DEMO_NUMBER = "09 886 0125";
export const DEMO_TEL = "+6498860125";

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
      <a
        href={`tel:${DEMO_TEL}`}
        className="group flex items-center gap-4 rounded-full border border-white/15 bg-white/5 py-2 pl-6 pr-2 shadow-[0_0_40px_rgba(37,99,235,0.25)] backdrop-blur transition hover:border-blue-500/60 hover:bg-white/10"
      >
        <span className="text-lg font-medium tracking-wide tabular-nums">{DEMO_NUMBER}</span>
        <span className="flex h-11 items-center gap-2 rounded-full bg-blue-600 px-5 text-sm font-semibold text-white transition group-hover:bg-blue-500">
          <PhoneIcon className="h-4 w-4" />
          Hear it answer
        </span>
      </a>
      <p className="text-sm text-white/50">
        {caption ?? "Don’t take our word for it — ring the demo line right now. Answers 24/7."}
      </p>
    </div>
  );
}
