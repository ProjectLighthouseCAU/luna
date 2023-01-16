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
        <>
          <li>
            <Link to={child.path}>{child.displayName}</Link>
          </li>
          {node.children.length > 0 ? <RouteLinks node={child} /> : null}
        </>
      ))}
    </ul>
  );
}
