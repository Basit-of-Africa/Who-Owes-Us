
import { cn } from "@/lib/utils";

interface Props {
  score: number;
  className?: string;
}

export function AccountabilityBadge({ score, className }: Props) {
  const getColor = (s: number) => {
    if (s >= 80) return "bg-red-100 text-red-700 border-red-200";
    if (s >= 50) return "bg-orange-100 text-orange-700 border-orange-200";
    return "bg-green-100 text-green-700 border-green-200";
  };

  return (
    <div className={cn(
      "px-3 py-1 rounded-full border text-sm font-bold flex items-center gap-2",
      getColor(score),
      className
    )}>
      <span>Score: {score}</span>
    </div>
  );
}
