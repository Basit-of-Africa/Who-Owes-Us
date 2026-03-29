
import { cn } from "@/lib/utils";

interface Props {
  score: number;
  className?: string;
}

export function AccountabilityBadge({ score, className }: Props) {
  const getColor = (s: number) => {
    if (s >= 80) return "bg-red-50 text-red-600 border-red-200";
    if (s >= 50) return "bg-orange-50 text-orange-600 border-orange-200";
    if (s >= 20) return "bg-blue-50 text-blue-600 border-blue-200";
    return "bg-green-50 text-green-600 border-green-200";
  };

  return (
    <div className={cn(
      "px-3 py-1 rounded-md border text-[10px] font-black uppercase tracking-widest flex items-center gap-2",
      getColor(score),
      className
    )}>
      <span>Score: {score}</span>
    </div>
  );
}
