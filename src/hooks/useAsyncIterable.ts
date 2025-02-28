import { useEffect } from 'react';

// https://stackoverflow.com/a/68791731

export function useAsyncIterable<T>(
  iterable: () => Promise<AsyncIterable<T>>,
  consumer: (value: T) => any,
  onError?: (error: any) => any
) {
  useEffect(() => {
    let isCancelled = false;
    (async () => {
      try {
        for await (const value of await iterable()) {
          if (isCancelled) {
            break;
          }
          consumer(value);
        }
      } catch (error) {
        if (onError) {
          onError(error);
        } else {
          throw error;
        }
      }
    })();
    return () => {
      isCancelled = true;
    };
  }, [iterable, consumer, onError]);
}
