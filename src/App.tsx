import React, { useRef } from 'react';
import styled from 'styled-components';
import { Display } from './components/Display';

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

export function App() {
  const width = 300;
  const height = 300;
  return (
    <Container>
      <Display maxWidth={width} maxHeight={height} display={new Uint8Array()} />
    </Container>
  );
}
