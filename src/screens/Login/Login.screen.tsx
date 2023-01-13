import { WindowDimensionsContext } from '@luna/contexts/WindowDimensions';
import { Breakpoint, useBreakpoint } from '@luna/hooks/Breakpoint';
import { LiveDisplay } from '@luna/views/LiveDisplay';
import {
  Button,
  Card,
  Grid,
  Input,
  Row,
  Spacer,
  Text,
} from '@nextui-org/react';
import React, { useContext } from 'react';

export function LoginScreen() {
  const { width } = useContext(WindowDimensionsContext);
  const breakpoint = useBreakpoint();

  let displayWidth: number;
  switch (breakpoint) {
    case Breakpoint.Xs:
    case Breakpoint.Sm:
    case Breakpoint.Md:
      displayWidth = width * 0.8;
      break;
    case Breakpoint.Lg:
      displayWidth = width / 2;
      break;
    default:
      displayWidth = Breakpoint.Xl / 2;
      break;
  }

  return (
    <Grid.Container gap={4} justify="center" alignItems="center">
      <Grid>
        <Grid.Container justify="center" alignItems="center">
          <Grid>
            <Text h1>Project Lighthouse</Text>
            <Card css={{ maxWidth: '400px' }}>
              <Card.Header>
                Sign in to view and manage your displays
              </Card.Header>
              <Card.Divider />
              <Card.Body>
                <Input labelLeft="Username" css={{ width: '100%' }} />
                <Spacer y={0.5} />
                <Input
                  labelLeft="Password"
                  type="password"
                  css={{ width: '100%' }}
                />
              </Card.Body>
              <Card.Footer>
                <Row justify="flex-end">
                  <Button
                    onPress={() => {
                      // TODO: Authenticate
                      window.location.href = '/home';
                    }}
                  >
                    Sign in
                  </Button>
                </Row>
              </Card.Footer>
            </Card>
          </Grid>
        </Grid.Container>
      </Grid>
      <Grid>
        <LiveDisplay width={displayWidth} />
      </Grid>
    </Grid.Container>
  );
}
