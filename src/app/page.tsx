"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Habit } from '@/types/habit';
import { AddHabitForm } from '@/components/habits/add-habit-form';
import { HabitList } from '@/components/habits/habit-list';
import { AppHeader } from '@/components/layout/app-header';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { getTodayDateString, getYesterdayDateString, parseISODate, differenceInCalendarDays } from '@/lib/date-utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, TrendingUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { AnimatePresence, motion } from 'framer-motion';

const calculateStreak = (completions: Record<string, boolean>, lastCompletedDate?: string): { currentStreak: number; longestStreak: number; newLastCompletedDate?: string } => {
  if (!Object.keys(completions).length) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  const sortedDates = Object.keys(completions)
    .filter(dateStr => completions[dateStr])
    .map(dateStr => parseISODate(dateStr))
    .sort((a, b) => b.getTime() - a.getTime());

  if (sortedDates.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }
  
  let currentStreak = 0;
  let longestStreak = 0;
  let streakEndDate = new Date(); // placeholder

  if (lastCompletedDate) {
    streakEndDate = parseISODate(lastCompletedDate);
    if (differenceInCalendarDays(new Date(), streakEndDate) <= 1) {
      // Potential current streak
      let tempStreak = 0;
      let currentDate = streakEndDate;
      for (let i = 0; i < sortedDates.length; i++) {
        if (differenceInCalendarDays(currentDate, sortedDates[i]) === 0) {
          tempStreak++;
          if (i + 1 < sortedDates.length) {
             currentDate = parseISODate(getYesterdayDateString(sortedDates[i]));
          } else {
            // end of sorted dates, break
            break;
          }
        } else if (differenceInCalendarDays(currentDate, sortedDates[i]) === 1 && completions[getYesterdayDateString(currentDate)]){
           tempStreak++;
           currentDate = parseISODate(getYesterdayDateString(sortedDates[i]));
        }
        else {
          break; 
        }
      }
      currentStreak = tempStreak;
    }
  }


  // Calculate longest streak
  if (sortedDates.length > 0) {
    let currentLongest = 1;
    let maxLongest = 1;
    for (let i = 0; i < sortedDates.length - 1; i++) {
      if (differenceInCalendarDays(sortedDates[i], sortedDates[i+1]) === 1) {
        currentLongest++;
      } else {
        maxLongest = Math.max(maxLongest, currentLongest);
        currentLongest = 1;
      }
    }
    longestStreak = Math.max(maxLongest, currentLongest);
  } else {
     longestStreak = 0;
  }
  
  return { currentStreak, longestStreak, newLastCompletedDate: sortedDates[0] ? getTodayDateString() : undefined };
};


export default function HomePage() {
  const initialHabits = useMemo(() => [], []);
  const [habits, setHabits, isLoaded] = useLocalStorage<Habit[]>('habits', initialHabits);

  const addHabit = (name: string) => {
    const newHabit: Habit = {
      id: crypto.randomUUID(),
      name,
      createdAt: new Date().toISOString(),
      completions: {},
      currentStreak: 0,
      longestStreak: 0,
    };
    setHabits((prevHabits) => [...prevHabits, newHabit]);
  };

  const toggleHabitCompletion = useCallback((habitId: string, date: string) => {
    setHabits((prevHabits) =>
      prevHabits.map((habit) => {
        if (habit.id === habitId) {
          const newCompletions = { ...habit.completions };
          newCompletions[date] = !newCompletions[date];
          
          const { currentStreak, longestStreak, newLastCompletedDate } = calculateStreak(newCompletions, newCompletions[date] ? date : habit.lastCompletedDate);

          return {
            ...habit,
            completions: newCompletions,
            currentStreak,
            longestStreak: Math.max(habit.longestStreak, longestStreak, currentStreak),
            lastCompletedDate: newCompletions[date] ? date : (currentStreak === 0 ? undefined : habit.lastCompletedDate),
          };
        }
        return habit;
      })
    );
  }, [setHabits]);

  const deleteHabit = (habitId: string) => {
    setHabits((prevHabits) => prevHabits.filter((habit) => habit.id !== habitId));
  };
  
  // Recalculate streaks on load and when today changes (e.g. past midnight)
  useEffect(() => {
    if (!isLoaded) return;

    const todayStr = getTodayDateString();
    setHabits(prevHabits => prevHabits.map(habit => {
      const { currentStreak, longestStreak, newLastCompletedDate } = calculateStreak(habit.completions, habit.lastCompletedDate);
      // If last completed was yesterday and not marked today, streak breaks unless it was already broken.
      let finalCurrentStreak = currentStreak;
      if (habit.lastCompletedDate && differenceInCalendarDays(parseISODate(todayStr), parseISODate(habit.lastCompletedDate)) > 1 && !habit.completions[todayStr]) {
          finalCurrentStreak = 0;
      }

      return {
        ...habit,
        currentStreak: finalCurrentStreak,
        longestStreak: Math.max(habit.longestStreak, longestStreak, finalCurrentStreak),
        // lastCompletedDate is updated by toggleHabitCompletion
      };
    }));
  }, [isLoaded, setHabits]);


  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-grow container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <AddHabitForm onAddHabit={addHabit} />
        </motion.div>

        <Card className="shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <TrendingUp className="text-primary" />
              Your Habits
            </CardTitle>
            <CardDescription>Track your daily progress and build lasting habits.</CardDescription>
          </CardHeader>
          <CardContent>
            {!isLoaded ? (
              <div className="space-y-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : (
              <HabitList
                habits={habits}
                onToggleComplete={toggleHabitCompletion}
                onDeleteHabit={deleteHabit}
              />
            )}
          </CardContent>
        </Card>
        
        {isLoaded && habits.length > 0 && (
           <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
           >
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <BarChart className="text-primary" />
                  Overall Progress
                </CardTitle>
                <CardDescription>A quick glance at your habit journey.</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Total Habits Tracked: {habits.length}</p>
                <p>Habits Completed Today: {habits.filter(h => h.completions[getTodayDateString()]).length}</p>
                {/* More stats can be added here later */}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </main>
      <footer className="text-center py-4 border-t text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Habitual. Stay consistent!</p>
      </footer>
    </div>
  );
}
