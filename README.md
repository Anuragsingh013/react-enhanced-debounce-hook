# react-enhanced-debounce-hook

A tiny, dependency-free React hook library for debouncing values and state.
Includes two ergonomic APIs so you can pick the pattern that fits your use-case:

* `useDebounce(value, delay?, options?)` — API-compatible with [`use-debounce`](https://github.com/xnimorz/use-debounce) (returns debounced value + controls).
* `useDebounceState(initial, delay?)` — single-hook UX that returns immediate value, setter, debounced value, and controls (no need for two local states).

Perfect for **search inputs, typeaheads, autosave, preventing noisy API calls, and improving UI responsiveness**.

---

## Install

```bash
npm install react-enhanced-debounce-hook
# or
yarn add react-enhanced-debounce-hook
```

simple usage example in CodeSandbox:
https://codesandbox.io/p/sandbox/8vxv8j

---

## Usage

### `useDebounceState(initial, delay?)`

```jsx
import React, { useEffect } from "react";
import { useDebounceState } from "react-enhanced-debounce-hook";

function SearchBox() {
  const [value, setValue, debouncedValue] = useDebounceState("", 300);

  useEffect(() => {
    if (debouncedValue) {
      console.log("Trigger API call with:", debouncedValue);
      // fetch(`/api/search?q=${debouncedValue}`)
    }
  }, [debouncedValue]);

  return (
    <div>
      <input
        type="text"
        placeholder="Search..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <p>Immediate: {value}</p>
      <p>Debounced (after 300ms): {debouncedValue}</p>
    </div>
  );
}
```

---

### `useDebounce(value, delay?, options?)`

```jsx
import React, { useState } from "react";
import { useDebounce } from "react-enhanced-debounce-hook";

export default function DemoUseDebounce() {
  const [text, setText] = useState("Hello");
  // const [debouncedText, controls] = useDebounce(text, 1000);
  const [debouncedText] = useDebounce(text, 1000);

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h3>useDebounce demo</h3>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{ padding: 8, width: 320 }}
      />
      <div style={{ marginTop: 8 }}>
        <div>
          Actual value: <b>{text}</b>
        </div>
        <div>
          Debounced value: <b>{debouncedText}</b>
        </div>
      </div>

      {/* <div style={{ marginTop: 8 }}>
        <button onClick={() => controls.flush()}>Flush (apply now)</button>
        <button onClick={() => controls.cancel()} style={{ marginLeft: 8 }}>
          Cancel pending
        </button>
      </div> */}
    </div>
  );
}

```

---

## API Reference

### `useDebounce(value, delay?, options?)`

* **value**: any value to debounce
* **delay**: debounce time in ms (default: `500`)
* **options**:

  * `leading`: trigger immediately on the first call
  * `trailing`: trigger after the delay (default: `true`)

**Returns:** `[debouncedValue, controls]`

* `debouncedValue` — the debounced version of your value
* `controls` — `{ cancel, flush }` to cancel or force flush

---

### `useDebounceState(initial, delay?)`

* **initial**: initial state value
* **delay**: debounce time in ms

**Returns:** `[value, setValue, debouncedValue, controls]`

* `value` — the immediate state (updates instantly)
* `setValue` — setter function
* `debouncedValue` — debounced state (updates after delay)
* `controls` — `{ cancel, flush }`

---

## When to Use Which?

* Use **`useDebounce`** if you already manage your own state.
* Use **`useDebounceState`** if you want a single hook to handle both **immediate and debounced state** without boilerplate.

---

## License

MIT © 2025
