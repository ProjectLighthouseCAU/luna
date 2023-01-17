import React, { useContext } from 'react';
import { LoginScreen } from '@luna/screens/Login';
import { Container } from '@nextui-org/react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { HomeScreen } from '@luna/screens/Home';
import { NotFoundScreen } from '@luna/screens/NotFound';
import { AuthContext } from '@luna/contexts/Auth';
import { RouteNode, ROUTE_TREE } from '@luna/routes';

function routerRoute({
  node,
  keyPrefix = [],
}: {
  node: RouteNode;
  keyPrefix?: string[];
}) {
  if (node.index) {
    return (
      <Route
        index
        key={[...keyPrefix, '_index'].join('/')}
        path={node.path}
        element={node.element?.()}
      />
    );
  } else {
    console.assert(node.path, 'Non-index routes cannot omit their path!');
    return (
      <Route key={node.path} path={node.path} element={node.element?.()}>
        {node.children.map(node =>
          routerRoute({ node, keyPrefix: [...keyPrefix, node.path!] })
        )}
      </Route>
    );
  }
}

export function AppContainer() {
  const auth = useContext(AuthContext);

  return (
    <Container>
      <Routes>
        <Route
          path="/"
          element={
            auth.token ? <HomeScreen /> : <Navigate replace to="login" />
          }
        >
          <Route index element={<Navigate replace to="displays" />} />
          {ROUTE_TREE.children.map(node => routerRoute({ node }))}
        </Route>
        <Route path="/login" element={<LoginScreen />} />
        <Route path="*" element={<NotFoundScreen />} />
      </Routes>
    </Container>
  );
}
