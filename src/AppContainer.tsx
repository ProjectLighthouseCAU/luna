import React, { useContext } from 'react';
import { LoginScreen } from '@luna/screens/login/LoginScreen';
import { Navigate, Route, Routes } from 'react-router-dom';
import { HomeScreen } from '@luna/screens/home/HomeScreen';
import { NotFoundScreen } from '@luna/screens/notfound/NotFoundScreen';
import { AuthContext } from '@luna/contexts/AuthContext';
import { ROUTE_TREE } from '@luna/routes';
import { RouteNode } from '@luna/types/RouteNode';

function routerRoute({
  node,
  keyPrefix = [],
}: {
  node: RouteNode;
  keyPrefix?: string[];
}) {
  console.assert(node.path, 'Non-index routes cannot omit their path!');
  const childKeyPrefix = [...keyPrefix, node.path!];
  return (
    <Route
      key={[...keyPrefix, node.path].join('/')}
      path={node.path}
      element={node.element?.()}
    >
      {node.index ? <Route index element={node.index.element?.()} /> : null}
      {node.children?.map(node =>
        routerRoute({ node, keyPrefix: childKeyPrefix })
      )}
    </Route>
  );
}

export function AppContainer() {
  const auth = useContext(AuthContext);

  return (
    <div className="h-screen">
      <Routes>
        <Route
          path="/"
          element={
            auth.token ? <HomeScreen /> : <Navigate replace to="login" />
          }
        >
          <Route index element={<Navigate replace to="displays" />} />
          {ROUTE_TREE.children?.map(node => routerRoute({ node }))}
        </Route>
        <Route path="/login" element={<LoginScreen />} />
        <Route path="*" element={<NotFoundScreen />} />
      </Routes>
    </div>
  );
}
