"use client";

import { useState, useEffect, useRef, startTransition } from "react";

export function useAnimatedNumber(
  target: number,
  duration: number = 1000,
  enabled: boolean = true
): number {
  const [current, setCurrent] = useState(0);
  const previousTarget = useRef(0);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    if (!enabled) {
      startTransition(() => {
        setCurrent(target);
      });
      return;
    }

    const startValue = previousTarget.current;
    const startTime = performance.now();
    const diff = target - startValue;

    if (diff === 0) return;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = startValue + diff * eased;

      setCurrent(value);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        previousTarget.current = target;
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [target, duration, enabled]);

  return current;
}
