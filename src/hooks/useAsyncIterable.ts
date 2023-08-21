import { useEffect } from 'react';

// https://stackoverflow.com/a/68791731

export function useAsyncIterable<T>(
  iterable: () => AsyncIterable<T>,
  consumer: (value: T) => Promise<void>
) {
  useEffect(() => {
    let isCancelled = false;
    (async () => {
      for await (const value of iterable()) {
        consumer(value);
        if (isCancelled) {
          break;
        }
      }
    })();
    return () => {
      isCancelled = true;
    };
  }, [iterable, consumer]);
}
