import { lookupRouteNode, RouteNode, ROUTE_TREE } from '@luna/routes';
import { useLocation } from 'react-router-dom';

export function useRouteNode(): RouteNode | undefined {
  const location = useLocation();
  return lookupRouteNode(ROUTE_TREE, location.pathname.split('/'));
}
