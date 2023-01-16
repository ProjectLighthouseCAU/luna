import { RouteNode } from '@luna/routes';
import React from 'react';
import { Link } from 'react-router-dom';

interface RouteLinksParams {
  node: RouteNode;
}

export function RouteLinks({ node }: RouteLinksParams) {
  return (
    <ul>
      {node.children.map(child => (
        <li key={child.path}>
          <Link to={child.path}>
            {child.icon?.()}
            {child.displayName}
          </Link>
          {node.children.length > 0 ? <RouteLinks node={child} /> : null}
        </li>
      ))}
    </ul>
  );
}
