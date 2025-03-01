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
          if (result.done) {
            break;
          }
          // Make sure not to call the consumer when we're done, in the raced
          // cancellation case we'd get `undefined`, but if the async iterable
          // ends naturally this will be its return value, e.g. an array in a
          // mergeAsyncIterable result. For details, see
          // https://stackoverflow.com/questions/50585456/how-can-i-interleave-merge-async-iterables/50586391#comment140164278_50586391.
          consumer(result.value);
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
