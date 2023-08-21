import { ReactNode, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';

export interface HomeContentProps {
  title: string;
  children: ReactNode;
}

export function HomeContent({ title, children }: HomeContentProps) {
  const setTitle: (title: string) => void = useOutletContext();

  useEffect(() => {
    setTitle(title);
  }, [title, setTitle]);

  return <>{children}</>;
}
