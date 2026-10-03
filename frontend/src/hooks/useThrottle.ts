import { useRef, useCallback } from "react";

// Throttle: limits how often a function can fire — useful for map pan/zoom events
export function useThrottle<T extends (...args: unknown[]) => void>(fn: T, limitMs: number): T {
  const lastRun = useRef(0);
  return useCallback(
    ((...args: unknown[]) => {
      const now = Date.now();
      if (now - lastRun.current >= limitMs) {
        lastRun.current = now;
        fn(...args);
      }
    }) as T,
    [fn, limitMs]
  );
}
