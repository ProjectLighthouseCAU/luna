import { ModelContext } from '@luna/contexts/api/model/ModelContext';
import { useAsyncIterable } from '@luna/hooks/useAsyncIterable';
import { useCallback, useContext, useState } from 'react';

export function useStream(path: string[]): unknown | undefined {
  const { api } = useContext(ModelContext);
  const [value, setValue] = useState<unknown>();

  const streamValue = useCallback(() => {
    console.log(`Streaming ${path}`);
    return api.stream(path);
  }, [api, path]);

  const handleStreamError = useCallback(
    (error: any) => {
      console.warn(`Error while streaming ${path}: ${error}`);
    },
    [path]
  );

  useAsyncIterable(streamValue, setValue, handleStreamError);

  return value;
}
