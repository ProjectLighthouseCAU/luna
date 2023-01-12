import React, { useContext } from 'react';
import { Display } from './components/Display';
import { WindowDimensionsContext } from './contexts/WindowDimensions';
import { LIGHTHOUSE_FRAME_BYTES } from 'nighthouse/browser';
import { styled } from '@stitches/react';

const Wrapper = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
});

export function AppContainer() {
  const dimensions = useContext(WindowDimensionsContext);

  return (
    <Wrapper>
      <Display
        maxWidth={dimensions.width}
        maxHeight={dimensions.height}
        frame={new Uint8Array(LIGHTHOUSE_FRAME_BYTES)}
      />
    </Wrapper>
  );
}
