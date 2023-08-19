import { AuthContext } from '@luna/contexts/AuthContext';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Input,
} from '@nextui-org/react';
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

export function LoginCard() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <Card className="w-full">
      <form
        onSubmit={e => {
          e.preventDefault();
          // TODO: Authenticate
          auth.setToken('blub');
          navigate('/home/displays');
        }}
      >
        <CardHeader>Sign in to view and manage your displays</CardHeader>
        <Divider />
        <CardBody className="w-full space-y-6">
          <div className="space-y-2">
            <Input size="sm" label="Username" aria-label="Username" />
            <Input
              size="sm"
              label="Password"
              aria-label="Password"
              type="password"
            />
          </div>
          <Button type="submit">Sign in</Button>
        </CardBody>
      </form>
    </Card>
  );
}
