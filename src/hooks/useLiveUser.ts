import { ModelContext } from '@luna/contexts/api/model/ModelContext';
import { useStream } from '@luna/hooks/useStream';
import { useContext, useMemo } from 'react';

export function useLiveUser() {
  const livePath = useStream<string[]>(['live']);
  const { users } = useContext(ModelContext);

  const liveUsername = useMemo(
    () =>
      livePath &&
      livePath.length === 3 &&
      livePath[0] === 'user' &&
      livePath[2] === 'model' &&
      users.all.contains(livePath[1])
        ? livePath[1]
        : undefined,
    [livePath, users.all]
  );

  return { liveUsername };
}
