import { Card, CardBody, CardHeader } from '@nextui-org/react';
import { ReactNode } from 'react';

export interface DisplayInspectorCardProps {
  icon: ReactNode;
  title: string;
  children?: ReactNode;
}

export function DisplayInspectorCard({
  title,
  icon,
  children,
}: DisplayInspectorCardProps) {
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
