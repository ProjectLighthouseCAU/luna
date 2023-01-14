import { Button, Card, Input, Row, Spacer } from '@nextui-org/react';
import React from 'react';

export function LoginCard() {
  return (
    <Card css={{ maxWidth: '400px' }}>
      <Card.Header>Sign in to view and manage your displays</Card.Header>
      <Card.Divider />
      <Card.Body>
        <Input labelLeft="Username" css={{ width: '100%' }} />
        <Spacer y={0.5} />
        <Input labelLeft="Password" type="password" css={{ width: '100%' }} />
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
  );
}
