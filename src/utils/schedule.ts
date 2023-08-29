/**
 * Throttles the given action to the given interval.
 */
export function throttle<T extends Array<any>>(
  action: (...args: T) => void,
  intervalMs: number
): (...args: T) => void {
  let lastCalled = 0;
  let isScheduled = false;

  return (...args) => {
    if (isScheduled) return;
    const now = Date.now();
    if (now - lastCalled >= intervalMs) {
      lastCalled = now;
      action(...args);
    } else {
      isScheduled = true;
      window.setTimeout(() => {
        action(...args);
        lastCalled = Date.now();
        isScheduled = false;
      }, intervalMs);
    }
  };
}

/**
 * Debounces an action to the given interval.
 */
export function debounce<T extends Array<any>>(
  action: (...args: T) => void,
  intervalMs: number
): (...args: T) => void {
  let timeoutId: number | null = null;

  return (...args) => {
    if (timeoutId !== null) {
      window.clearTimeout(timeoutId);
    }
    timeoutId = window.setTimeout(() => {
      action(...args);
      timeoutId = null;
    }, intervalMs);
  };
}
