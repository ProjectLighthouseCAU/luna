import React from 'react';
import { styled } from '@stitches/react';
import { LoginScreen } from '@luna/screens/Login';

const Wrapper = styled('div', {
  display: 'flex',
  width: '100%',
  height: '100%',
});

export function AppContainer() {
  return (
    <Wrapper>
      <LoginScreen />
    </Wrapper>
  );
}
