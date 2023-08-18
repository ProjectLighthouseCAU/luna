import { RouteNode } from '@luna/types/RouteNode';
import { NavLink } from 'react-router-dom';

interface RouteLinkParams {
  node: RouteNode;
  childrenOnly?: boolean;
  linkPrefix?: string[];
  expandedPath?: string[];
  className?: string;
}

export function RouteLink({
  node,
  childrenOnly = false,
  linkPrefix = [],
  expandedPath,
  className,
}: RouteLinkParams) {
  return (
    <div className={className}>
      {!childrenOnly ? (
        <NavLink
          to={[...linkPrefix, node.path].join('/')}
          className={({ isActive }) =>
            `${isActive ? 'bg-primary text-white' : ''} px-2 py-1.5 rounded`
          }
        >
          {node.icon?.()}
          {node.displayName}
        </NavLink>
      ) : null}
      {expandedPath === undefined ||
      (expandedPath.length > 0 && expandedPath[0] === node.path) ? (
        <ul>
          {node.children?.map(child => (
            <li key={child.path}>
              <RouteLink
                node={child}
                linkPrefix={[...linkPrefix, ...(node.path ? [node.path] : [])]}
                expandedPath={expandedPath?.slice(1)}
                className={`space-y-1.5 ${childrenOnly ? '' : 'ml-4'}`}
              />
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
