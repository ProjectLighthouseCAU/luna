import {
  defaultHomeContentLayout,
  HomeContentLayout,
} from '@luna/screens/home/helpers/HomeContentLayout';
import { ReactNode, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';

export interface HomeContentProps {
  title: string;
  toolbar?: ReactNode;
  layout?: HomeContentLayout;
  children: ReactNode;
}

export interface HomeContentContext {
  setTitle(title: string): void;

  setToolbar(toolbar: ReactNode): void;

  setLayout(layout: HomeContentLayout): void;
}

export function HomeContent({
  title,
  toolbar,
  children,
  layout = defaultHomeContentLayout,
}: HomeContentProps) {
  const context = useOutletContext<HomeContentContext>();

  useEffect(() => {
    context.setTitle(title);
  }, [context, title]);

  useEffect(() => {
    context.setToolbar(toolbar);
  }, [toolbar, context]);

  useEffect(() => {
    context.setLayout(layout);
  }, [context, layout]);

  return <>{children}</>;
}
