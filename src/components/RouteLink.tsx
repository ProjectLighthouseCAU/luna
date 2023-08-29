import { Button } from '@nextui-org/react';
import { IconChevronDown, IconChevronRight } from '@tabler/icons-react';
import { ReactNode, useCallback, useState } from 'react';
import { NavLink } from 'react-router-dom';

interface RouteLinkParams {
  icon: ReactNode;
  name: string;
  path: string;
  className?: string;
  children?: ReactNode;
}

export function RouteLink({
  icon,
  name,
  path,
  className,
  children,
}: RouteLinkParams) {
  const [isExpanded, setExpanded] = useState(true);

  const toggleExpanded = useCallback(() => {
    setExpanded(isExpanded => !isExpanded);
  }, []);

  return (
    <div className={`flex flex-col space-y-1 ${className}`}>
      <NavLink
        to={path}
        end
        className={({ isActive }) =>
          `${
            isActive ? 'bg-primary text-white' : ''
          } px-2 py-1.5 rounded flex flex-row justify-between`
        }
      >
        <div className="flex flex-row gap-2">
          {icon}
          {name}
        </div>
        {children ? (
          <Button isIconOnly onPress={toggleExpanded} variant="light" size="sm">
            {isExpanded ? <IconChevronDown /> : <IconChevronRight />}
          </Button>
        ) : null}
      </NavLink>
      {isExpanded ? <div className="ml-4">{children}</div> : null}
    </div>
  );
}
