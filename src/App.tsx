import React from 'react';
import styled from 'styled-components';
import { Display } from './components/Display';

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const Sized = styled.div<{ width: number; height: number }>`
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  background-color: red;
`;

export function App() {
  const width = 300;
  const height = 300;
  return (
    <Container>
      <Sized width={width} height={height}>
        <Display
          maxWidth={width}
          maxHeight={height}
          display={new Uint8Array()}
        />
      </Sized>
    </Container>
  );
}
