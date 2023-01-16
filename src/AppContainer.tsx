import React, { useContext } from 'react';
import { LoginScreen } from '@luna/screens/Login';
import { Container } from '@nextui-org/react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { HomeScreen } from '@luna/screens/Home';
import { NotFoundScreen } from '@luna/screens/NotFound';
import { Displays } from '@luna/views/Displays';
import { Admin } from '@luna/views/Admin';
import { AuthContext } from '@luna/contexts/Auth';

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
          <Route path="admin" element={<Admin />} />
          <Route path="displays" element={<Displays />} />
        </Route>
        <Route path="/login" element={<LoginScreen />} />
        <Route path="*" element={<NotFoundScreen />} />
      </Routes>
    </Container>
  );
}
