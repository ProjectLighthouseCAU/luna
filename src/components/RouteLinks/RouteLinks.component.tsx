import { ROUTE_TREE } from '@luna/routes';
import React from 'react';
import { Link } from 'react-router-dom';

export function RouteLinks() {
  return (
    <ul>
      {ROUTE_TREE.children.map(node => (
        <li>
          <Link to={node.name}>{node.displayName}</Link>
        </li>
      ))}
    </ul>
  );
}
