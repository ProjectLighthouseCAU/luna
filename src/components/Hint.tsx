import { ReactNode } from 'react';

export interface HintProps {
  children: ReactNode;
}

export function Hint({ children }: HintProps) {
  return <div className="italic text-xs opacity-50">{children}</div>;
}
