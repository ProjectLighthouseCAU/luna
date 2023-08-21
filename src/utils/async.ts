/**
 * Sleeps for the given number of milliseconds.
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Maps a function over an async iterable.
 */
export async function* mapAsyncIterable<T, U>(
  asyncIterable: AsyncIterable<T>,
  transform: (value: T, index: number) => U
): AsyncIterable<U> {
  // https://stackoverflow.com/a/67795001
  let index = 0;
  for await (const value of asyncIterable) {
    yield transform(value, index);
    index++;
  }
}

/**
 * Combines an iterable sequence of async iterables into
 * a single async iterable.
 */
export async function* mergeAsyncIterables<T>(
  iterable: Iterable<AsyncIterable<T>>
): AsyncIterable<T> {
  // https://stackoverflow.com/a/50586391
  const asyncIterators = Array.from(iterable, o => o[Symbol.asyncIterator]());
  const results = [];
  let count = asyncIterators.length;
  const never = new Promise<{ index: number; result: IteratorResult<T> }>(
    () => {}
  );
  function getNext(asyncIterator: AsyncIterator<T>, index: number) {
    return asyncIterator.next().then(result => ({
      index,
      result,
    }));
  }
  const nextPromises = asyncIterators.map(getNext);
  try {
    while (count) {
      const { index, result } = await Promise.race(nextPromises);
      if (result.done) {
        nextPromises[index] = never;
        results[index] = result.value;
        count--;
      } else {
        nextPromises[index] = getNext(asyncIterators[index], index);
        yield result.value;
      }
    }
  } finally {
    for (const [index, iterator] of asyncIterators.entries())
      if (nextPromises[index] !== never && iterator.return !== undefined)
        iterator.return();
    // no await here - see https://github.com/tc39/proposal-async-iteration/issues/126
  }
  return results;
}
