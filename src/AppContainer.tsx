import React from 'react';
import { LoginScreen } from '@luna/screens/Login';
import { Container } from '@nextui-org/react';
import { Route, Routes } from 'react-router-dom';
import { HomeScreen } from '@luna/screens/Home';
import { NotFoundScreen } from '@luna/screens/NotFound';

export function AppContainer() {
  return (
    <Container>
      <Routes>
        <Route index element={<LoginScreen />}></Route>
        <Route path="home" element={<HomeScreen />}></Route>
        <Route path="*" element={<NotFoundScreen />}></Route>
      </Routes>
    </Container>
  );
}
