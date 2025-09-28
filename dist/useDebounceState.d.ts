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
export declare function useDebounceState<T>(initialValue: T, delay?: number): [
    T,
    (updater: T | ((prev: T) => T), immediate?: boolean) => void,
    T,
    DebounceStateControls
];
