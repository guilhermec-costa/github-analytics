import React from "react";

export default function useDebounce(
  callback: (...args: any[]) => void,
  delay: number,
) {
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  function debounce(...args: any[]) {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }

  return debounce;
}
