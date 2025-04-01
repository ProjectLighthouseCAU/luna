import { Spinner } from '@heroui/react';
import { ModelContext } from '@luna/contexts/api/model/ModelContext';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';

export interface ResourcesContentsViewProps {
  path: string[];
  className?: string;
}

export function ResourcesContentsView({
  path,
  className,
}: ResourcesContentsViewProps) {
  const { api } = useContext(ModelContext);

  const [valueWrapper, setValue] = useState<{
    value: any;
    userEdited: boolean;
  }>({ value: undefined, userEdited: false });

  const [error, setError] = useState<string>();
  const preRef = useRef<HTMLPreElement | null>(null);

  useEffect(() => {
    (async () => {
      const result = await api.get(path);
      if (result.ok) {
        setValue({ value: result.value, userEdited: false });
      } else {
        setError(`${result.error}`);
      }
    })();
  }, [api, path]);

  const onChange = useCallback(async () => {
    const pre = preRef.current;
    if (pre === null) {
      return;
    }
    try {
      const parsedValue = JSON.parse(pre.innerText);
      setValue({ value: parsedValue, userEdited: true });
      await api.put(path, parsedValue);
    } catch {
      // Swallow parse errors
    }
  }, [api, path]);

  useEffect(() => {
    const pre = preRef.current;
    if (pre === null) {
      return;
    }
    if (!valueWrapper.userEdited) {
      pre.innerText = JSON.stringify(valueWrapper.value, null, 2);
    }
  }, [valueWrapper]);

  return (
    <div className={className}>
      {valueWrapper !== undefined ? (
        <pre ref={preRef} contentEditable onInput={onChange} />
      ) : error ? (
        error
      ) : (
        <Spinner />
      )}
    </div>
  );
}
