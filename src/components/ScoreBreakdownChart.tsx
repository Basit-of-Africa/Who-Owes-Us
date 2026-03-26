
'use client';

import { 
  Bar, 
  BarChart, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ScoreBreakdown } from "@/lib/types";

const chartConfig = {
  value: {
    label: "Score Weight",
    color: "hsl(var(--accent))",
  },
} satisfies ChartConfig;

export function ScoreBreakdownChart({ breakdown }: { breakdown: ScoreBreakdown }) {
  const data = [
    { name: "Convictions", value: breakdown.convictions * 8, color: "hsl(0 84% 60%)" },
    { name: "Charges", value: breakdown.charges * 4, color: "hsl(24 95% 53%)" },
    { name: "Inquiries", value: breakdown.investigations * 2, color: "hsl(199 89% 48%)" },
    { name: "Restitution", value: breakdown.forfeitedFactor, color: "hsl(var(--accent))" },
    { name: "Detention", value: breakdown.detentionDays, color: "hsl(262 83% 58%)" },
  ].filter(d => d.value > 0);

  if (data.length === 0) return null;

  return (
    <div className="h-[200px] w-full mt-6">
      <ChartContainer config={chartConfig}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: -20, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} vertical={true} opacity={0.1} />
            <XAxis type="number" hide />
            <YAxis 
              dataKey="name" 
              type="category" 
              axisLine={false} 
              tickLine={false}
              tick={{ fill: 'currentColor', fontSize: 10, fontWeight: 700 }}
              width={80}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
      <p className="text-[9px] text-center font-bold text-muted-foreground uppercase tracking-widest mt-2 opacity-60">
        Weighted Point Contribution
      </p>
    </div>
  );
}
