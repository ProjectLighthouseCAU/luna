import { ReactNode } from 'react';
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
  return (
    <div className={`flex flex-col space-y-1 ${className}`}>
      <NavLink
        to={path}
        end
        className={({ isActive }) =>
          `${isActive ? 'bg-primary text-white' : ''} px-2 py-1.5 rounded`
        }
      >
        {icon}
        {name}
      </NavLink>
      <div className="ml-4">{children}</div>
    </div>
  );
}
