import React from 'react';
import { styled } from '@stitches/react';
import { LoginScreen } from '@luna/screens/Login';

const Wrapper = styled('div', {
  display: 'flex',
  alignItems: 'stretch',
  justifyContent: 'center',
});

export function AppContainer() {
  return (
    <Wrapper>
      <LoginScreen />
    </Wrapper>
  );
}
