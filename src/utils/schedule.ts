/**
 * Throttles the given action to the given interval.
 */
export function throttle(action: () => void, intervalMs: number): () => void {
  let lastCalled = 0;
  let isScheduled = false;

  return () => {
    if (isScheduled) return;
    const now = Date.now();
    if (now - lastCalled >= intervalMs) {
      lastCalled = now;
      action();
    } else {
      isScheduled = true;
      window.setTimeout(() => {
        action();
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
