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
      setTimeout(() => {
        action();
        lastCalled = Date.now();
        isScheduled = false;
      }, intervalMs);
    }
  };
}
