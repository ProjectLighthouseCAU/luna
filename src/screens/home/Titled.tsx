import { ReactNode, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';

export interface TitledProps {
  title: string;
  children: ReactNode;
}

export function Titled({ title, children }: TitledProps) {
  const setTitle: (title: string) => void = useOutletContext();

  useEffect(() => {
    setTitle(title);
  }, [title, setTitle]);

  return <>{children}</>;
}
