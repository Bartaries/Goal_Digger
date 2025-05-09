
"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Habit, HabitFrequency } from '@/types/habit';
import { AddHabitForm } from '@/components/habits/add-habit-form';
import { HabitList } from '@/components/habits/habit-list';
import { AppHeader } from '@/components/layout/app-header';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { getTodayDateString, getYesterdayDateString, parseISODate, differenceInCalendarDays as fnsDifferenceInCalendarDays } from '@/lib/date-utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Brain, Zap } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { ProgressChart } from '@/components/habits/progress-chart';
import { LoginForm } from '@/components/auth/login-form';


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
  let streakEndDate = new Date(); 

  if (lastCompletedDate) {
    streakEndDate = parseISODate(lastCompletedDate);
    if (fnsDifferenceInCalendarDays(new Date(), streakEndDate) <= 1) {
      
      let tempStreak = 0;
      let currentDate = streakEndDate;
      for (let i = 0; i < sortedDates.length; i++) {
        if (fnsDifferenceInCalendarDays(currentDate, sortedDates[i]) === 0) {
          tempStreak++;
          if (i + 1 < sortedDates.length) {
             currentDate = parseISODate(getYesterdayDateString(sortedDates[i]));
          } else {
            
            break;
          }
        } else if (fnsDifferenceInCalendarDays(currentDate, sortedDates[i]) === 1 && completions[getYesterdayDateString(currentDate)]){
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


  
  if (sortedDates.length > 0) {
    let currentLongest = 1;
    let maxLongest = 1;
    for (let i = 0; i < sortedDates.length - 1; i++) {
      if (fnsDifferenceInCalendarDays(sortedDates[i], sortedDates[i+1]) === 1) {
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


export default function AppEntryPoint() {
  const [loggedInUser, setLoggedInUser, isUserLoaded] = useLocalStorage<string | null>('loggedInUser', null);

  const handleLoginSuccess = (username: string) => {
    setLoggedInUser(username);
  };

  if (!isUserLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Brain className="h-16 w-16 text-primary animate-pulse" />
      </div>
    );
  }

  if (!loggedInUser) {
    return <LoginForm onLoginSuccess={handleLoginSuccess} />;
  }

  return <HomePageContent username={loggedInUser} />;
}

interface HomePageContentProps {
  username: string;
}

function HomePageContent({ username }: HomePageContentProps) {
  const initialHabits = useMemo(() => [], []);
  const [habits, setHabits, isLoaded] = useLocalStorage<Habit[]>('habits', initialHabits);


  const addHabit = (name: string, frequency: HabitFrequency) => {
    const newHabit: Habit = {
      id: crypto.randomUUID(),
      name,
      frequency,
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
          
          const { currentStreak, longestStreak } = calculateStreak(newCompletions, newCompletions[date] ? date : habit.lastCompletedDate);

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
  
  
  useEffect(() => {
    if (!isLoaded) return;

    const todayStr = getTodayDateString();
    setHabits(prevHabits => prevHabits.map(habit => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { currentStreak, longestStreak } = calculateStreak(habit.completions, habit.lastCompletedDate);
      
      let finalCurrentStreak = currentStreak;
      if (habit.lastCompletedDate && fnsDifferenceInCalendarDays(parseISODate(todayStr), parseISODate(habit.lastCompletedDate)) > 1 && !habit.completions[todayStr]) {
          finalCurrentStreak = 0;
      }

      return {
        ...habit,
        currentStreak: finalCurrentStreak,
        longestStreak: Math.max(habit.longestStreak, longestStreak, finalCurrentStreak),
        
      };
    }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  const overallLongestStreak = useMemo(() => {
    if (habits.length === 0) {
      return 0;
    }
    return Math.max(0, ...habits.map(h => h.longestStreak));
  }, [habits]);


  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader username={username} />
      <main className="flex-grow container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <AddHabitForm onAddHabit={addHabit} />
        </motion.div>

        <Card className="shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <span className="flex items-center text-primary">
                <Brain className="h-6 w-6" />
              </span>
              Twoje nawyki
            </CardTitle>
            <CardDescription>Śledź swoje codzienne postępy i buduj trwałe nawyki.</CardDescription>
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
                  <LineChart className="text-primary" />
                  Ogólny postęp
                </CardTitle>
                <CardDescription>Krótki przegląd Twojej drogi do wyrobienia sobie nawyku, w tym postępów w ciągu ostatnich 7 dni.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 text-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Łączna liczba nawyków</p>
                    <p className="text-2xl font-bold text-primary">{habits.length}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Nawyki ukończone dzisiaj</p>
                    <p className="text-2xl font-bold text-primary">{habits.filter(h => h.completions[getTodayDateString()]).length}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Najdłuższy streak (ogólnie)</p>
                    <p className="text-2xl font-bold text-primary flex items-center justify-center gap-1">
                       {overallLongestStreak} <Zap className="h-5 w-5 text-yellow-500"/>
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="text-md font-semibold mb-2 text-center sm:text-left">Aktywność w ostatnich 7 dniach</h3>
                  <ProgressChart habits={habits} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </main>
    </div>
  );
}

