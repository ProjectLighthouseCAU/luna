import { ModelContext } from '@luna/contexts/api/model/ModelContext';
import { useAsyncIterable } from '@luna/hooks/useAsyncIterable';
import { useCallback, useContext, useState } from 'react';

export function useStream<T>(path: string[]): T | undefined {
  const { api } = useContext(ModelContext);
  const [value, setValue] = useState<T>();

  const streamValue = useCallback(() => {
    console.log(`Streaming ${path}`);
    return api.stream(path) as AsyncIterable<T>;
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
