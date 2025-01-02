import { useState } from "react";

export default function useLocalStorage<T>(key: string, defaultValue?: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.get(key);
      return item ? item : defaultValue;
    } catch (error) {
      console.error(error);
      return defaultValue;
    }
  });

  function setValue(_value: any) {
    setStoredValue(_value);
    localStorage.setItem(key, _value);
  }

  return { storedValue, setValue };
}
