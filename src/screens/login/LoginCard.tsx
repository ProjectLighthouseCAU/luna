import { AuthContext } from '@luna/contexts/AuthContext';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Input,
  Spacer,
} from '@nextui-org/react';
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

export function LoginCard() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <Card style={{ maxWidth: '400px' }}>
      <form
        onSubmit={e => {
          e.preventDefault();
          // TODO: Authenticate
          auth.setToken('blub');
          navigate('/displays');
        }}
      >
        <CardHeader>Sign in to view and manage your displays</CardHeader>
        <Divider />
        <CardBody>
          <Input
            label="Username"
            aria-label="Username"
            style={{ width: '100%' }}
          />
          <Spacer y={0.5} />
          <Input
            label="Password"
            aria-label="Password"
            type="password"
            style={{ width: '100%' }}
          />
        </CardBody>
        <CardFooter>
          {/* TODO: Right-aligned layout */}
          <div>
            <Button type="submit">Sign in</Button>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
