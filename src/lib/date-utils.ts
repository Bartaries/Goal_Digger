import { format, parseISO, isToday as fnsIsToday, isYesterday as fnsIsYesterday, subDays, isValid } from 'date-fns';

export const DATE_FORMAT = 'yyyy-MM-dd';

export const getFormattedDate = (date: Date): string => {
  return format(date, DATE_FORMAT);
};

export const getTodayDateString = (): string => {
  return getFormattedDate(new Date());
};

export const isDateToday = (dateString: string): boolean => {
  const date = parseISO(dateString);
  return isValid(date) && fnsIsToday(date);
};

export const isDateYesterday = (dateString: string): boolean => {
  const date = parseISO(dateString);
  return isValid(date) && fnsIsYesterday(date);
};

export const getYesterdayDateString = (date: Date = new Date()): string => {
  return getFormattedDate(subDays(date, 1));
};
