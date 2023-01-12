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
import React from 'react';

export function LoginScreen() {
  return (
    <Container justify="center">
      <Col>
        <Text h1>Project Lighthouse</Text>
        <Card css={{ maxWidth: '400px' }}>
          <Card.Header>Sign in to view and manage your displays</Card.Header>
          <Card.Divider />
          <Card.Body>
            <Container
              display="flex"
              direction="column"
              css={{ padding: 0, gap: '10px' }}
            >
              <Input labelLeft="Username" />
              <Input labelLeft="Password" type="password" />
            </Container>
          </Card.Body>
          <Card.Footer>
            <Row justify="flex-end">
              <Button>Sign in</Button>
            </Row>
          </Card.Footer>
        </Card>
      </Col>
      <Grid xs={4}></Grid>
    </Container>
  );
}
