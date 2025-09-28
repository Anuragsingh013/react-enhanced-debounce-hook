import { useEffect, useRef, useState } from "react";

export type DebounceControls = {
  flush: () => void;
  cancel: () => void;
};

export type DebounceOptions = {
  leading?: boolean; // if true, update immediately on first change, then debounce subsequent changes
};

/**
 * useDebounce
 * API-compatible with `use-debounce`:
 * const [debouncedValue, controls] = useDebounce(value, delay?, options?)
 *
 * - debouncedValue: value that follows `value` after `delay` ms of inactivity (or immediately if leading)
 * - controls: { flush(), cancel() }
 */
export function useDebounce<T>(
  value: T,
  delay = 500,
  options?: DebounceOptions
): [T, DebounceControls] {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const timeoutRef = useRef<number | null>(null);
  const lastRef = useRef<T>(value);
  const leadingFiredRef = useRef<boolean>(false);

  useEffect(() => {
    lastRef.current = value;
  }, [value]);

  useEffect(() => {
    // clear existing timer
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (options?.leading) {
      if (!leadingFiredRef.current) {
        // fire immediately on leading edge
        setDebouncedValue(value);
        leadingFiredRef.current = true;

        // set timer to reset leading flag at end of window
        timeoutRef.current = (globalThis.setTimeout(() => {
          timeoutRef.current = null;
          leadingFiredRef.current = false;
        }, delay) as unknown) as number;

        return () => {
          if (timeoutRef.current !== null) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }
        };
      } else {
        // already fired leading in this window — schedule trailing update
        timeoutRef.current = (globalThis.setTimeout(() => {
          setDebouncedValue(lastRef.current);
          timeoutRef.current = null;
          leadingFiredRef.current = false;
        }, delay) as unknown) as number;
      }
    } else {
      // normal trailing debounce behaviour
      timeoutRef.current = (globalThis.setTimeout(() => {
        setDebouncedValue(value);
        timeoutRef.current = null;
      }, delay) as unknown) as number;
    }

    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
    // intentionally include options?.leading in deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, delay, options?.leading]);

  const cancel = () => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const flush = () => {
    cancel();
    setDebouncedValue(lastRef.current);
    leadingFiredRef.current = false;
  };

  return [debouncedValue, { flush, cancel }];
}
