import { useEffect, useRef, useState } from "react";
/**
 * useDebounce
 * API-compatible with `use-debounce`:
 * const [debouncedValue, controls] = useDebounce(value, delay?, options?)
 *
 * - debouncedValue: value that follows `value` after `delay` ms of inactivity (or immediately if leading)
 * - controls: { flush(), cancel() }
 */
export function useDebounce(value, delay, options) {
    if (delay === void 0) { delay = 500; }
    var _a = useState(value), debouncedValue = _a[0], setDebouncedValue = _a[1];
    var timeoutRef = useRef(null);
    var lastRef = useRef(value);
    var leadingFiredRef = useRef(false);
    useEffect(function () {
        lastRef.current = value;
    }, [value]);
    useEffect(function () {
        // clear existing timer
        if (timeoutRef.current !== null) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        if (options === null || options === void 0 ? void 0 : options.leading) {
            if (!leadingFiredRef.current) {
                // fire immediately on leading edge
                setDebouncedValue(value);
                leadingFiredRef.current = true;
                // set timer to reset leading flag at end of window
                timeoutRef.current = globalThis.setTimeout(function () {
                    timeoutRef.current = null;
                    leadingFiredRef.current = false;
                }, delay);
                return function () {
                    if (timeoutRef.current !== null) {
                        clearTimeout(timeoutRef.current);
                        timeoutRef.current = null;
                    }
                };
            }
            else {
                // already fired leading in this window — schedule trailing update
                timeoutRef.current = globalThis.setTimeout(function () {
                    setDebouncedValue(lastRef.current);
                    timeoutRef.current = null;
                    leadingFiredRef.current = false;
                }, delay);
            }
        }
        else {
            // normal trailing debounce behaviour
            timeoutRef.current = globalThis.setTimeout(function () {
                setDebouncedValue(value);
                timeoutRef.current = null;
            }, delay);
        }
        return function () {
            if (timeoutRef.current !== null) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
        };
        // intentionally include options?.leading in deps
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value, delay, options === null || options === void 0 ? void 0 : options.leading]);
    var cancel = function () {
        if (timeoutRef.current !== null) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    };
    var flush = function () {
        cancel();
        setDebouncedValue(lastRef.current);
        leadingFiredRef.current = false;
    };
    return [debouncedValue, { flush: flush, cancel: cancel }];
}
