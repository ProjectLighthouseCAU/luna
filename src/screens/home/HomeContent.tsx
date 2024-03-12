import { ReactNode, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';

export interface HomeContentProps {
  title: string;
  toolbar?: ReactNode;
  children: ReactNode;
}

export interface HomeContentContext {
  setTitle(title: string): void;

  setToolbar(toolbar: ReactNode): void;
}

export function HomeContent({ title, toolbar, children }: HomeContentProps) {
  const context = useOutletContext<HomeContentContext>();

  useEffect(() => {
    context.setTitle(title);
    context.setToolbar(toolbar);
  }, [title, toolbar, context]);

  return <>{children}</>;
}
