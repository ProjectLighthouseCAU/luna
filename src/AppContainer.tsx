import React from 'react';
import { styled } from '@stitches/react';
import { HomeScreen } from '@luna/screens/Home';

const Wrapper = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
});

export function AppContainer() {
  return (
    <Wrapper>
      <HomeScreen />
    </Wrapper>
  );
}
