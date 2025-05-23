"use client";

import type { Habit } from '@/types/habit';
import { Bar, BarChart as RechartsBarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { ShadcnChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";
import { useMemo } from 'react';
import { parseISODate, differenceInCalendarDays, getTodayDateString } from '@/lib/date-utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface ProgressChartProps {
  habits: Habit[];
}

const chartConfig: ChartConfig = {
  completions: {
    label: "Completions",
    color: "hsl(var(--primary))",
  },
};


export function ProgressChart({ habits }: ProgressChartProps) {
  const today = useMemo(() => parseISODate(getTodayDateString()), []);
  const isMobile = useIsMobile();

  const chartData = useMemo(() => {
    return habits.map(habit => {
      let completionsLast7Days = 0;
      Object.keys(habit.completions).forEach(dateStr => {
        if (habit.completions[dateStr]) {
          const completionDate = parseISODate(dateStr);
          const diff = differenceInCalendarDays(today, completionDate);
          if (diff >= 0 && diff < 7) { 
            completionsLast7Days++;
          }
        }
      });

      const originalName = habit.name;
      let displayName = originalName;

      const DESKTOP_TRUNCATE_THRESHOLD = 20;
      const DESKTOP_TRUNCATE_LENGTH = 17;
      const MOBILE_FIRST_LAST_THRESHOLD = 4; 

      if (isMobile) {
        if (originalName.length > MOBILE_FIRST_LAST_THRESHOLD) {
          displayName = `${originalName.charAt(0).toUpperCase()}..${originalName.charAt(originalName.length - 1)}`;
        }
      } else { 
        if (originalName.length > DESKTOP_TRUNCATE_THRESHOLD) {
          displayName = originalName.substring(0, DESKTOP_TRUNCATE_LENGTH) + "...";
        }
      }
      
      return {
        name: displayName, 
        completions: completionsLast7Days,
        originalName: originalName, 
      };
    });
  }, [habits, today, isMobile]);

  if (!habits.length) {
    return <p className="text-muted-foreground text-center py-4">Dodaj nawyk aby widzieć swój progres.</p>;
  }
  
  if (chartData.every(d => d.completions === 0)) {
     return <p className="text-muted-foreground text-center py-4">Brak wykonanych nawyków w ostatnich 7 dniach. Nie poddawaj się!</p>;
  }

  const maxYValue = Math.max(5, ...chartData.map(d => d.completions));


  return (
    <ShadcnChartContainer config={chartConfig} className="min-h-[250px] w-full aspect-video">
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
                        formatter={(value, name, item) => { 
                          const count = Number(value);
                          const timesStr = count === 1 ? 'time' : 'times';
                          return [`${count} ${timesStr}`, name === 'completions' ? 'Completed (last 7 days)' : String(name)];
                        }}
                        labelFormatter={(label, payload) => { 
                          if (payload && payload.length > 0 && payload[0] && payload[0].payload) {
                            return payload[0].payload.originalName || label;
                          }
                          return label;
                        }}
                        labelClassName="font-semibold"
                    />}
          />
          <Bar dataKey="completions" fill="var(--color-completions)" radius={[4, 4, 0, 0]} />
        </RechartsBarChart>
      </ResponsiveContainer>
    </ShadcnChartContainer>
  );
}

