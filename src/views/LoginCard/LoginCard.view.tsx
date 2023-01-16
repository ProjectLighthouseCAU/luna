import { AuthContext } from '@luna/contexts/Auth';
import { Button, Card, Input, Row, Spacer } from '@nextui-org/react';
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

export function LoginCard() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <Card css={{ maxWidth: '400px' }}>
      <form
        onSubmit={e => {
          e.preventDefault();
          // TODO: Authenticate
          auth.setToken('blub');
          navigate('/displays');
        }}
      >
        <Card.Header>Sign in to view and manage your displays</Card.Header>
        <Card.Divider />
        <Card.Body>
          <Input labelLeft="Username" css={{ width: '100%' }} />
          <Spacer y={0.5} />
          <Input labelLeft="Password" type="password" css={{ width: '100%' }} />
        </Card.Body>
        <Card.Footer>
          <Row justify="flex-end">
            <Button type="submit">Sign in</Button>
          </Row>
        </Card.Footer>
      </form>
    </Card>
  );
}
