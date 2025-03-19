import { useStream } from '@luna/hooks/useStream';
import { useMemo } from 'react';

export function useLiveUser() {
  const livePath = useStream<string[]>(['live']);

  const liveUsername = useMemo(
    () =>
      livePath &&
      livePath.length === 3 &&
      livePath[0] === 'user' &&
      livePath[2] === 'model'
        ? livePath[1]
        : undefined,
    [livePath]
  );

  return { liveUsername };
}
