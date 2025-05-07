import { useState, useEffect, useCallback } from 'react';

type SetValue<T> = (value: T | ((val: T) => T)) => void;

export function useLocalStorage<T>(key: string, initialValue: T): [T, SetValue<T>, boolean] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // This effect runs only on the client
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      // Fallback to initialValue if error during parse or if item is not found,
      // as useState already initialized with initialValue.
    }
    setIsLoaded(true);
  }, [key, initialValue]);

  const setValue: SetValue<T> = useCallback(
    (value) => {
      try {
        // Use a functional update for `setStoredValue` to ensure it has the latest state
        // if `value` is a state updater function.
        setStoredValue((prevStoredValue) => {
          const valueToStore = value instanceof Function ? value(prevStoredValue) : value;
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
          return valueToStore;
        });
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key] // Dependency only on `key` ensures `setValue` is stable for a given key.
  );

  return [storedValue, setValue, isLoaded];
}
