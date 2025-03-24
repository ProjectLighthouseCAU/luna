import { Card, CardBody, CardHeader } from '@heroui/react';
import { AnimatedPresence } from '@luna/components/AnimatedPresence';
import { IconChevronDown, IconChevronRight } from '@tabler/icons-react';
import { ReactNode, useCallback, useState } from 'react';

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
  const [isCollapsed, setCollapsed] = useState(false);

  const onClickHeader = useCallback(() => {
    if (isCollapsible) {
      setCollapsed(isCollapsed => !isCollapsed);
    }
  }, [isCollapsible]);

  return (
    <Card>
      <CardHeader onClick={onClickHeader}>
        <div className="flex flex-row justify-between w-full">
          <div className="flex flex-row gap-2">
            {icon}
            <span className="font-bold select-none">{title}</span>
          </div>
          {isCollapsible ? (
            isCollapsed ? (
              <IconChevronRight />
            ) : (
              <IconChevronDown />
            )
          ) : null}
        </div>
      </CardHeader>
      {children ? (
        <CardBody>
          {isCollapsible ? (
            <AnimatedPresence isShown={!isCollapsed}>
              {children}
            </AnimatedPresence>
          ) : (
            children
          )}
        </CardBody>
      ) : null}
    </Card>
  );
}
