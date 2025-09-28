import { useEffect, useRef, useState } from "react";
/**
 * useDebounceState
 * Returns [value, setValue, debouncedValue, controls]
 *
 * - value: immediate value to bind to input
 * - setValue: setter (accepts value or functional updater). optional second arg `immediate` to update debouncedValue immediately
 * - debouncedValue: value that updates after delay ms of inactivity
 * - controls: { flush, cancel }
 */
export function useDebounceState(initialValue, delay) {
    if (delay === void 0) { delay = 500; }
    var _a = useState(initialValue), value = _a[0], setValue = _a[1];
    var _b = useState(initialValue), debouncedValue = _b[0], setDebouncedValue = _b[1];
    var timeoutRef = useRef(null);
    useEffect(function () {
        return function () {
            if (timeoutRef.current !== null) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
        };
    }, []);
    var cancel = function () {
        if (timeoutRef.current !== null) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    };
    var flush = function () {
        cancel();
        setDebouncedValue(value);
    };
    function setDebouncedState(updater, immediate) {
        if (immediate === void 0) { immediate = false; }
        setValue(function (prev) {
            var next = typeof updater === "function"
                ? updater(prev)
                : updater;
            // clear existing timer
            if (timeoutRef.current !== null) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
            if (immediate) {
                setDebouncedValue(next);
            }
            else {
                timeoutRef.current = globalThis.setTimeout(function () {
                    setDebouncedValue(next);
                    timeoutRef.current = null;
                }, delay);
            }
            return next;
        });
    }
    return [value, setDebouncedState, debouncedValue, { flush: flush, cancel: cancel }];
}
