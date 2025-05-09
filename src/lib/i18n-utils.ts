
import type { HabitFrequency } from '@/types/habit';

export function getDaySuffix(days: number): string {
  if (days === 1) {
    return "dzień"; 
  }
  
  return "dni"; 
}

export function translateFrequency(frequency: HabitFrequency, capitalize = true): string {
  let translated: string;
  switch (frequency) {
    case 'daily':
      translated = 'codziennie'; 
      break;
    case 'weekly':
      translated = 'co tydzień'; 
      break;
    case 'monthly':
      translated = 'co miesiąc'; 
      break;
    default:
      
      translated = frequency;
  }
  
  
  
  return capitalize ? translated.charAt(0).toUpperCase() + translated.slice(1) : translated;
}

