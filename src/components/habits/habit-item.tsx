"use client";

import type { Habit } from '@/types/habit';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, Flame, Trash2, Zap, Repeat } from 'lucide-react';
import { getTodayDateString } from '@/lib/date-utils';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface HabitItemProps {
  habit: Habit;
  onToggleComplete: (habitId: string, date: string) => void;
  onDeleteHabit: (habitId: string) => void;
}

export function HabitItem({ habit, onToggleComplete, onDeleteHabit }: HabitItemProps) {
  const todayString = getTodayDateString();
  const isCompletedToday = habit.completions[todayString] || false;

  const handleToggle = () => {
    onToggleComplete(habit.id, todayString);
  };

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="mb-4 shadow-md hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg font-semibold">{habit.name}</CardTitle>
              <Badge variant="secondary" className="mt-1">
                <Repeat className="mr-1 h-3 w-3" />
                {capitalize(habit.frequency)}
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDeleteHabit(habit.id)}
              aria-label={`Delete habit ${habit.name}`}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-2 pb-4">
          <div className="flex items-center justify-between">
            <Button
              onClick={handleToggle}
              variant={isCompletedToday ? "default" : "outline"}
              className={cn(
                "w-full text-left justify-start transition-all duration-300 ease-in-out",
                isCompletedToday ? "bg-accent hover:bg-accent/90 text-accent-foreground" : "hover:bg-secondary"
              )}
              aria-pressed={isCompletedToday}
            >
              {isCompletedToday ? (
                <CheckCircle className="mr-2 h-5 w-5 text-accent-foreground" />
              ) : (
                <Circle className="mr-2 h-5 w-5 text-primary" />
              )}
              {isCompletedToday ? 'Completed Today!' : 'Mark as Complete'}
            </Button>
          </div>
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground flex justify-between pt-2 pb-4">
          <div className="flex items-center gap-1">
            <Flame className="h-4 w-4 text-orange-500" />
            <span>Current Streak: {habit.currentStreak} {habit.currentStreak === 1 ? "day" : "days"}</span>
          </div>
          <div className="flex items-center gap-1">
            <Zap className="h-4 w-4 text-yellow-500" />
            <span>Longest Streak: {habit.longestStreak} {habit.longestStreak === 1 ? "day" : "days"}</span>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
