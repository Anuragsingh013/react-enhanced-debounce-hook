export type DebounceControls = {
    flush: () => void;
    cancel: () => void;
};
export type DebounceOptions = {
    leading?: boolean;
};
/**
 * useDebounce
 * API-compatible with `use-debounce`:
 * const [debouncedValue, controls] = useDebounce(value, delay?, options?)
 *
 * - debouncedValue: value that follows `value` after `delay` ms of inactivity (or immediately if leading)
 * - controls: { flush(), cancel() }
 */
export declare function useDebounce<T>(value: T, delay?: number, options?: DebounceOptions): [T, DebounceControls];
