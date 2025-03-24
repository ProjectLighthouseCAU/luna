import { Card, CardBody, CardHeader } from '@heroui/react';
import { ReactNode } from 'react';

export interface TitledCardProps {
  icon: ReactNode;
  title: string;
  isCollapsible?: boolean;
  children?: ReactNode;
}

export function TitledCard({
  title,
  icon,
  children,
  isCollapsible = false,
}: TitledCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-row space-x-2">
          {icon}
          <span className="font-bold">{title}</span>
        </div>
      </CardHeader>
      {children ? <CardBody>{children}</CardBody> : null}
    </Card>
  );
}
