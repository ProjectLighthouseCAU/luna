import { ModelContext } from '@luna/contexts/api/model/ModelContext';
import { useStream } from '@luna/hooks/useStream';
import { useCallback, useContext, useMemo } from 'react';

const metaPath = ['live'];

export function useLiveUser() {
  const { users } = useContext(ModelContext);
  const { api } = useContext(ModelContext);

  const livePath = useStream<string[]>(metaPath);

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

  const setLiveUsername = useCallback(
    (username: string) => {
      (async () => {
        await api.put(metaPath, ['user', username, 'model']);
      })();
    },
    [api]
  );

  return { liveUsername, setLiveUsername };
}
