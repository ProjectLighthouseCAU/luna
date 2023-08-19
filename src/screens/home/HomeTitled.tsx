import { ReactNode, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';

export interface HomeTitledProps {
  title: string;
  children: ReactNode;
}

export function HomeTitled({ title, children }: HomeTitledProps) {
  const setTitle: (title: string) => void = useOutletContext();

  useEffect(() => {
    setTitle(title);
  }, [title, setTitle]);

  return <>{children}</>;
}
