import { RouteNode } from '@luna/routes';
import React from 'react';
import { Link } from 'react-router-dom';

interface RouteLinkParams {
  node: RouteNode;
  childrenOnly?: boolean;
  linkPrefix?: string[];
  expandedPath?: string[];
}

export function RouteLink({
  node,
  childrenOnly = false,
  linkPrefix = [],
  expandedPath,
}: RouteLinkParams) {
  return (
    <>
      {!childrenOnly && !node.index ? (
        <Link to={[...linkPrefix, node.path].join('/')}>
          {node.icon?.()}
          {node.displayName}
        </Link>
      ) : null}
      {expandedPath === undefined ||
      (expandedPath.length > 0 && expandedPath[0] === node.path) ? (
        <ul>
          {node.children.map(child => (
            <li key={child.index ? '_index' : child.path}>
              {node.children.length > 0 ? (
                <RouteLink
                  node={child}
                  linkPrefix={[
                    ...linkPrefix,
                    ...(node.path ? [node.path] : []),
                  ]}
                  expandedPath={expandedPath?.slice(1)}
                />
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}
    </>
  );
}
