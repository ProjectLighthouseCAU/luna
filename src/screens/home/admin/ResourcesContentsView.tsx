import { Spinner } from '@heroui/react';
import { ModelContext } from '@luna/contexts/api/model/ModelContext';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';

export interface ResourcesContentsViewProps {
  path: string[];
}

export function ResourcesContentsView({ path }: ResourcesContentsViewProps) {
  const model = useContext(ModelContext);

  const [valueWrapper, setValue] = useState<{
    value: any;
    userEdited: boolean;
  }>({ value: undefined, userEdited: false });

  const [error, setError] = useState<string>();
  const preRef = useRef<HTMLPreElement | null>(null);

  useEffect(() => {
    (async () => {
      const result = await model.get(path);
      if (result.ok) {
        setValue({ value: result.value, userEdited: false });
      } else {
        setError(`${result.error}`);
      }
    })();
  }, [model, path]);

  const onChange = useCallback(() => {
    const pre = preRef.current;
    if (pre === null) {
      return;
    }
    try {
      const parsedValue = JSON.parse(pre.innerText);
      console.log('Parsed', parsedValue);
      setValue({ value: parsedValue, userEdited: true });
    } catch {
      // Swallow parse errors
    }
  }, []);

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
    <div>
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
