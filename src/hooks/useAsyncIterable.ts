import { useEffect } from 'react';

// https://stackoverflow.com/a/68791731

export function useAsyncIterable<T>(
  iterable: () => AsyncIterable<T>,
  consumer: (value: T) => any,
  onError?: (error: any) => any
) {
  useEffect(() => {
    let cancelHandler: (() => void) | undefined = undefined;
    (async () => {
      const iterator = iterable()[Symbol.asyncIterator]();
      try {
        while (true) {
          const result = await Promise.race([
            iterator.next(),
            // eslint-disable-next-line no-loop-func
            new Promise<{ done: true; value: undefined }>(resolve => {
              cancelHandler = () => resolve({ done: true, value: undefined });
            }),
          ]);
          if (result.value !== undefined) {
            consumer(result.value);
          }
          if (result.done) {
            break;
          }
        }
      } catch (error) {
        if (onError) {
          onError(error);
        } else {
          throw error;
        }
      } finally {
        await iterator.return?.();
      }
    })();
    return () => {
      console.log('Cancelling');
      cancelHandler?.();
    };
  }, [iterable, consumer, onError]);
}
