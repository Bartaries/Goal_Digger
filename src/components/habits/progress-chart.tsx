"use client";

import type { Habit } from '@/types/habit';
import { Bar, BarChart as RechartsBarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";
import { useMemo } from 'react';
import { parseISODate, differenceInCalendarDays, getTodayDateString } from '@/lib/date-utils';

interface ProgressChartProps {
  habits: Habit[];
}

const chartConfig: ChartConfig = {
  completions: {
    label: "Ukończenia", 
    color: "hsl(var(--primary))", 
  },
};


export function ProgressChart({ habits }: ProgressChartProps) {
  const today = useMemo(() => parseISODate(getTodayDateString()), []);

  const chartData = useMemo(() => {
    return habits.map(habit => {
      let completionsLast7Days = 0;
      Object.keys(habit.completions).forEach(dateStr => {
        if (habit.completions[dateStr]) {
          const completionDate = parseISODate(dateStr);
          const diff = differenceInCalendarDays(today, completionDate);
          if (diff >= 0 && diff < 7) { // 0 for today, up to 6 for 6 days ago
            completionsLast7Days++;
          }
        }
      });
      return {
        name: habit.name.length > 20 ? habit.name.substring(0, 17) + "..." : habit.name, // Truncate long names for XAxis
        completions: completionsLast7Days,
      };
    });
  }, [habits, today]);

  if (!habits.length) {
    return <p className="text-muted-foreground text-center py-4">Dodaj nawyki, aby zobaczyć swój postęp!</p>;
  }
  
  if (chartData.every(d => d.completions === 0)) {
     return <p className="text-muted-foreground text-center py-4">Brak ukończeń w ciągu ostatnich 7 dni. Kontynuuj!</p>;
  }

  const maxYValue = Math.max(5, ...chartData.map(d => d.completions));


  return (
    <ChartContainer config={chartConfig} className="min-h-[250px] w-full aspect-video">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart 
            accessibilityLayer 
            data={chartData} 
            margin={{ top: 20, right: 20, left: -10, bottom: 5 }}
            barCategoryGap="20%"
        >
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            interval={0} 
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            dataKey="completions" 
            allowDecimals={false} 
            domain={[0, maxYValue]}
            tickCount={Math.min(maxYValue + 1, 6)}
            tick={{ fontSize: 12 }}
            width={30}
          />
          <ChartTooltip
            cursor={{ fill: "hsl(var(--muted) / 0.5)", radius: 4 }}
            content={<ChartTooltipContent  
                        formatter={(value, name) => {
                          const count = Number(value);
                          const timesStr = count === 1 ? 'raz' : 'razy';
                          return [\`${count} ${timesStr}\`, name === 'completions' ? 'Ukończono (ost. 7 dni)' : String(name)];
                        }}
                        labelClassName="font-semibold"
                    />}
          />
          <Bar dataKey="completions" fill="var(--color-completions)" radius={[4, 4, 0, 0]} />
        </RechartsBarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
