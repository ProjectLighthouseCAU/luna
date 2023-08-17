import { RouteNode } from '@luna/types/RouteNode';
import { Link } from 'react-router-dom';

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
        <Link to={[...linkPrefix, node.path].join('/')}>
          {node.icon?.()}
          {node.displayName}
        </Link>
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
                className={`space-y-3 ${childrenOnly ? '' : 'ml-4'}`}
              />
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
