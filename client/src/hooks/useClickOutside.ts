import React from "react";

export default function useClickOutside<T extends HTMLElement>(cb: () => void) {
  const EleRef = React.useRef<T>(null);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (EleRef.current && !EleRef.current.contains(e.target as Node)) {
        cb();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [cb]);

  return EleRef;
}
