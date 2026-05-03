import { useState, useEffect } from "react";

export function useLocalStorage(
  key: string,
  initialValue: string | null,
): [string | null, React.Dispatch<React.SetStateAction<string | null>>] {
  const [value, setValue] = useState<string | null>(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {}
  }, [key, value]);

  return [value, setValue];
}
