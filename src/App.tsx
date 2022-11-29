import React from 'react';
import styled from 'styled-components';
import { Display } from './components/Display';

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

export function App() {
  return (
    <Container>
      <Display />
    </Container>
  );
}
