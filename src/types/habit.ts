export type HabitFrequency = 'daily' | 'weekly' | 'monthly';

export interface Habit {
  id: string;
  name: string;
  frequency: HabitFrequency;
  createdAt: string; 
  
  completions: Record<string, boolean>;
  currentStreak: number;
  longestStreak: number;
  
  lastCompletedDate?: string;
}
