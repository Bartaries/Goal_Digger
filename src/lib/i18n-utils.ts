import type { HabitFrequency } from '@/types/habit';

export function getDaySuffix(days: number): string {
  if (days === 1) {
    return "day";
  }
  return "days";
}

export function translateFrequency(frequency: HabitFrequency, capitalize = true): string {
  let translated: string;
  switch (frequency) {
    case 'daily':
      translated = 'daily';
      break;
    case 'weekly':
      translated = 'weekly';
      break;
    case 'monthly':
      translated = 'monthly';
      break;
    default:
      translated = frequency;
  }
  return capitalize ? translated.charAt(0).toUpperCase() + translated.slice(1) : translated;
}
