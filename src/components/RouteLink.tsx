import { Button } from '@nextui-org/react';
import { IconChevronDown, IconChevronRight } from '@tabler/icons-react';
import { ReactNode, useCallback, useState } from 'react';
import { NavLink } from 'react-router-dom';

interface RouteLinkParams {
  icon: ReactNode;
  name: string;
  path: string;
  isSkeleton?: boolean;
  children?: ReactNode;
}

export function RouteLink({
  icon,
  name,
  path,
  isSkeleton = false,
  children,
}: RouteLinkParams) {
  const [isExpanded, setExpanded] = useState(true);

  const toggleExpanded = useCallback(() => {
    setExpanded(isExpanded => !isExpanded);
  }, []);

  return isSkeleton ? (
    <div className="h-10" />
  ) : (
    <div className={`flex flex-col space-y-1h-10`}>
      <NavLink
        to={path}
        end
        className={({ isActive }) =>
          `${
            isActive ? 'bg-primary text-white' : ''
          } px-2 py-1.5 rounded flex flex-row justify-between h-10`
        }
      >
        {({ isActive }) => (
          <>
            <div className="flex flex-row gap-2">
              {icon}
              {name}
            </div>
            {children ? (
              <Button
                isIconOnly
                onPress={toggleExpanded}
                variant="light"
                size="sm"
                className={isActive ? 'text-white' : ''}
              >
                {isExpanded ? <IconChevronDown /> : <IconChevronRight />}
              </Button>
            ) : null}
          </>
        )}
      </NavLink>
      {isExpanded ? <div className="ml-4">{children}</div> : null}
    </div>
  );
}
