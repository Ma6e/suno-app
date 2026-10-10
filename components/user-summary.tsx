import { Sparkles, BadgeDollarSign } from "lucide-react";

export function UserSummary({
  user,
  credits,
  name,
}: {
  user: any;
  credits: number;
  name: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center gap-3">
        <div className="rounded-xl border border-white/10 bg-[#7c9cff]/10 p-3">
          <Sparkles className="h-5 w-5 text-[#7c9cff]" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Welcome back</p>
          <h2 className="text-xl font-semibold text-white">{name}</h2>
        </div>
      </div>

      <div className="rounded-xl border border-[#5de4c6]/25 bg-[#5de4c6]/10 px-3 py-2 text-sm text-[#a7f7dd]">
        <div className="flex items-center gap-2">
          <BadgeDollarSign className="h-4 w-4" />
          {credits} credits
        </div>
      </div>
    </div>
  );
}
