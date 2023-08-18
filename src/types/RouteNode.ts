import { ReactNode } from 'react';

export interface RouteNode {
  path: string;
  displayName?: string;
  index?: RouteNode;
  element?: () => ReactNode;
  icon?: () => ReactNode;
  children?: RouteNode[];
}

// TODO: Add 'resolve' function to resolve RouteNode[] for the sidebar dynamically

export function lookupRouteNode(
  node: RouteNode,
  path: string[]
): RouteNode | undefined {
  if (path.length > 0) {
    if (node.path === path[0]) {
      return lookupRouteNode(node, path.slice(1));
    } else {
      const child = node.children?.find(
        child =>
          // TODO: Use a regex for matching this?
          child.path === path[0] ||
          child.path.startsWith(':') ||
          child.path.startsWith('*')
      );
      return child ? lookupRouteNode(child, path.slice(1)) : undefined;
    }
  } else {
    return node;
  }
}
