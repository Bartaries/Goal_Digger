
import type { HabitFrequency } from '@/types/habit';

export function getDaySuffix(days: number): string {
  if (days === 1) {
    return "dzień"; // Polish for "day"
  }
  // For 0, and plural (2, 3, 4, 5-21, etc.), "dni" is a common simplification.
  return "dni"; // Polish for "days"
}

export function translateFrequency(frequency: HabitFrequency, capitalize = true): string {
  let translated: string;
  switch (frequency) {
    case 'daily':
      translated = 'codziennie'; // Polish for "daily"
      break;
    case 'weekly':
      translated = 'co tydzień'; // Polish for "weekly"
      break;
    case 'monthly':
      translated = 'co miesiąc'; // Polish for "monthly"
      break;
    default:
      // Fallback for unexpected frequency values, though type system should prevent this.
      translated = frequency;
  }
  
  // Capitalize the first letter of the translated string.
  // This works for "Codziennie", "Co tydzień", "Co miesiąc".
  return capitalize ? translated.charAt(0).toUpperCase() + translated.slice(1) : translated;
}

