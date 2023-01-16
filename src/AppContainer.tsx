import React, { useContext } from 'react';
import { LoginScreen } from '@luna/screens/Login';
import { Container } from '@nextui-org/react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { HomeScreen } from '@luna/screens/Home';
import { NotFoundScreen } from '@luna/screens/NotFound';
import { AuthContext } from '@luna/contexts/Auth';
import { ROUTE_TREE } from '@luna/routes';

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
          {ROUTE_TREE.children.map(node => (
            <Route
              key={node.path}
              path={node.path}
              element={node.element?.()}
            />
          ))}
        </Route>
        <Route path="/login" element={<LoginScreen />} />
        <Route path="*" element={<NotFoundScreen />} />
      </Routes>
    </Container>
  );
}
