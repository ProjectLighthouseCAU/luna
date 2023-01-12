import { WindowDimensionsContext } from '@luna/contexts/WindowDimensions';
import { LiveDisplay } from '@luna/views/LiveDisplay';
import {
  Button,
  Card,
  Col,
  Container,
  Grid,
  Input,
  Row,
  Text,
} from '@nextui-org/react';
import React, { useContext } from 'react';

export function LoginScreen() {
  const { width, height } = useContext(WindowDimensionsContext);

  return (
    <Grid.Container gap={4} justify="center" alignItems="center">
      <Grid sm={6}>
        <Grid.Container justify="center" alignItems="center">
          <Grid>
            <Text h1>Project Lighthouse</Text>
            <Card css={{ maxWidth: '400px' }}>
              <Card.Header>
                Sign in to view and manage your displays
              </Card.Header>
              <Card.Divider />
              <Card.Body>
                <Grid.Container gap={1}>
                  <Grid xs={12}>
                    <Input labelLeft="Username" css={{ width: '100%' }} />
                  </Grid>
                  <Grid xs={12}>
                    <Input
                      labelLeft="Password"
                      type="password"
                      css={{ width: '100%' }}
                    />
                  </Grid>
                </Grid.Container>
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
      <Grid sm={6}>
        <Grid.Container justify="center" alignItems="center">
          <LiveDisplay maxWidth={width} maxHeight={0.8 * height} />
        </Grid.Container>
      </Grid>
    </Grid.Container>
  );
}
