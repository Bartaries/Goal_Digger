import type { HabitFrequency } from '@/types/habit';

export function getPolishDayForm(days: number): string {
  if (days === 1) {
    return "dzień";
  }
  // For UI simplicity, "dni" covers 0, 2,3,4 and 5+ and other complex cases
  return "dni";
}

export function translateFrequency(frequency: HabitFrequency, capitalize = true): string {
  let translated: string;
  switch (frequency) {
    case 'daily':
      translated = 'codziennie';
      break;
    case 'weekly':
      translated = 'tygodniowo';
      break;
    case 'monthly':
      translated = 'miesięcznie';
      break;
    default:
      // This case should ideally not be reached if HabitFrequency is strictly typed
      translated = frequency;
  }
  return capitalize ? translated.charAt(0).toUpperCase() + translated.slice(1) : translated;
}
