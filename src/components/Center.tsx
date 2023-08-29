import { ReactNode } from 'react';

export interface CenterProps {
  children: ReactNode;
}

export function Center({ children }: CenterProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      {children}
    </div>
  );
}
