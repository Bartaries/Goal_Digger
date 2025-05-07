export interface Habit {
  id: string;
  name: string;
  createdAt: string; // ISO date string
  // Record of completion dates, key: 'yyyy-MM-dd', value: true
  completions: Record<string, boolean>;
  currentStreak: number;
  longestStreak: number;
  // Last date this habit was completed, 'yyyy-MM-dd'
  lastCompletedDate?: string;
}
