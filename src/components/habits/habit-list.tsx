"use client";

import type { Habit } from '@/types/habit';
import { HabitItem } from './habit-item';
import { AnimatePresence } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';

interface HabitListProps {
  habits: Habit[];
  onToggleComplete: (habitId: string, date: string) => void;
  onDeleteHabit: (habitId: string) => void;
}

export function HabitList({ habits, onToggleComplete, onDeleteHabit }: HabitListProps) {
  if (habits.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        <p className="text-lg">No habits yet. Add one to get started!</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-280px)] pr-4"> {/* Adjust height as needed */}
      <AnimatePresence>
        {habits.map((habit) => (
          <HabitItem
            key={habit.id}
            habit={habit}
            onToggleComplete={onToggleComplete}
            onDeleteHabit={onDeleteHabit}
          />
        ))}
      </AnimatePresence>
    </ScrollArea>
  );
}
