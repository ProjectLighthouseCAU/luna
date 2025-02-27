import { Spinner } from '@heroui/react';
import { ModelContext } from '@luna/contexts/api/model/ModelContext';
import { useContext, useEffect, useState } from 'react';

export interface ResourcesContentsViewProps {
  path: string[];
}

export function ResourcesContentsView({ path }: ResourcesContentsViewProps) {
  const model = useContext(ModelContext);
  const [value, setValue] = useState<any>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    (async () => {
      const result = await model.get(path);
      console.log(result);
      if (result.ok) {
        setValue(result.value);
      } else {
        setError(`${result.error}`);
      }
    })();
  }, [model, path]);

  return (
    <>
      {value !== undefined ? (
        JSON.stringify(value)
      ) : error ? (
        error
      ) : (
        <Spinner />
      )}
    </>
  );
}
