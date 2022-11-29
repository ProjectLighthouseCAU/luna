import React, { useContext } from 'react';
import styled from 'styled-components';
import { Display } from './components/Display';
import { WindowDimensionsContext } from './contexts/WindowDimensionsContext';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

export function AppContainer() {
  const dimensions = useContext(WindowDimensionsContext);

  return (
    <Wrapper>
      <Display
        maxWidth={dimensions.width}
        maxHeight={dimensions.height}
        display={new Uint8Array()}
      />
    </Wrapper>
  );
}
