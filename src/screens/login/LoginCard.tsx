import { AuthContext } from '@luna/contexts/AuthContext';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Input,
} from '@nextui-org/react';
import React, { FormEvent, useCallback, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function LoginCard() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errored, setErrored] = useState(false);

  const logIn = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (await auth.client.logIn(username, password)) {
        navigate('/displays');
      } else {
        setErrored(true);
      }
    },
    [auth.client, navigate, username, password]
  );

  return (
    <Card className="w-full">
      <form onSubmit={logIn}>
        <CardHeader>Sign in to view and manage your displays</CardHeader>
        <Divider />
        <CardBody className="w-full space-y-6">
          <div className="space-y-2">
            <Input
              size="sm"
              label="Username"
              aria-label="Username"
              onValueChange={username => {
                setUsername(username);
                setErrored(false);
              }}
              validationState={errored ? 'invalid' : 'valid'}
            />
            <Input
              size="sm"
              label="Password"
              aria-label="Password"
              type="password"
              onValueChange={password => {
                setPassword(password);
                setErrored(false);
              }}
              validationState={errored ? 'invalid' : 'valid'}
              errorMessage={errored ? 'Could not sign in' : null}
            />
          </div>
          <Button type="submit">Sign in</Button>
        </CardBody>
      </form>
    </Card>
  );
}
