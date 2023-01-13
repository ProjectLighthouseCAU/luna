import { WindowDimensionsContext } from '@luna/contexts/WindowDimensions';
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
  const isXs = width <= 650;
  const isSm = width <= 960;

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
                  <Button>Sign in</Button>
                </Row>
              </Card.Footer>
            </Card>
          </Grid>
        </Grid.Container>
      </Grid>
      <Grid>
        <LiveDisplay width={isXs ? width : isSm ? width * 0.75 : width / 2} />
      </Grid>
    </Grid.Container>
  );
}
