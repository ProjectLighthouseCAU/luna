import { ModelContext } from '@luna/contexts/api/model/ModelContext';
import { useAsyncIterable } from '@luna/hooks/useAsyncIterable';
import { useJsonMemo } from '@luna/hooks/useJsonMemo';
import { useCallback, useContext, useState } from 'react';

export function useStream<T>(path_: string[]): T | undefined {
  // Prevent re-render loops if the passed path is a literal by rountripping it
  // through JSON (and thus a different instance each time, thus stopping +
  // starting a new stream on each render).
  const path = useJsonMemo(path_);

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
