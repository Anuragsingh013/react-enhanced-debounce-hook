import { useEffect, useRef, useState } from "react";

export type DebounceStateControls = {
  flush: () => void;
  cancel: () => void;
};

/**
 * useDebounceState
 * Returns [value, setValue, debouncedValue, controls]
 *
 * - value: immediate value to bind to input
 * - setValue: setter (accepts value or functional updater). optional second arg `immediate` to update debouncedValue immediately
 * - debouncedValue: value that updates after delay ms of inactivity
 * - controls: { flush, cancel }
 */
export function useDebounceState<T>(
  initialValue: T,
  delay = 500
): [
  T,
  (updater: T | ((prev: T) => T), immediate?: boolean) => void,
  T,
  DebounceStateControls
] {
  const [value, setValue] = useState<T>(initialValue);
  const [debouncedValue, setDebouncedValue] = useState<T>(initialValue);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  const cancel = () => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const flush = () => {
    cancel();
    setDebouncedValue(value);
  };

  function setDebouncedState(
    updater: T | ((prev: T) => T),
    immediate = false
  ) {
    setValue((prev) => {
      const next =
        typeof updater === "function"
          ? (updater as (p: T) => T)(prev)
          : updater;

      // clear existing timer
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      if (immediate) {
        setDebouncedValue(next);
      } else {
        timeoutRef.current = (globalThis.setTimeout(() => {
          setDebouncedValue(next);
          timeoutRef.current = null;
        }, delay) as unknown) as number;
      }

      return next;
    });
  }

  return [value, setDebouncedState, debouncedValue, { flush, cancel }];
}
