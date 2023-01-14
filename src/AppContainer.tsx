import React from 'react';
import { LoginScreen } from '@luna/screens/Login';
import { Container } from '@nextui-org/react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { HomeScreen } from '@luna/screens/Home';
import { NotFoundScreen } from '@luna/screens/NotFound';
import { Displays } from '@luna/views/Displays';
import { Admin } from '@luna/views/Admin';

export function AppContainer() {
  // TODO: Protect routes
  return (
    <Container>
      <Routes>
        <Route index element={<LoginScreen />} />
        <Route path="home" element={<HomeScreen />}>
          <Route index element={<Navigate replace to="displays" />} />
          <Route path="admin" element={<Admin />} />
          <Route path="displays" element={<Displays />} />
        </Route>
        <Route path="*" element={<NotFoundScreen />} />
      </Routes>
    </Container>
  );
}
