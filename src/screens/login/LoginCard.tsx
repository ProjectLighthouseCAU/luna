import { AuthContext } from '@luna/contexts/AuthContext';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Input,
} from '@nextui-org/react';
import { FormEvent, useCallback, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export interface LoginCardProps {
  showSignup: () => void;
}

export function LoginCard({ showSignup }: LoginCardProps) {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const logIn = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (username) {
        if (await auth.client.logIn(username, password)) {
          navigate('/displays');
        } else {
          setErrorMessage('Could not log in');
        }
      } else {
        setErrorMessage('Please enter a username');
      }
    },
    [auth.client, navigate, username, password]
  );

  const signUp = useCallback(async () => {
    showSignup();
  }, [showSignup]);

  return (
    <Card className="w-full">
      <form onSubmit={logIn}>
        <CardHeader>Login to view and manage your displays</CardHeader>
        <Divider />
        <CardBody className="w-full space-y-6">
          <div className="space-y-2">
            <Input
              size="sm"
              label="Username"
              aria-label="Username"
              onValueChange={username => {
                setUsername(username);
                setErrorMessage(null);
              }}
              validationState={errorMessage ? 'invalid' : 'valid'}
            />
            <Input
              size="sm"
              label="Password"
              aria-label="Password"
              type="password"
              onValueChange={password => {
                setPassword(password);
                setErrorMessage(null);
              }}
              validationState={errorMessage ? 'invalid' : 'valid'}
              errorMessage={errorMessage}
            />
          </div>
          <Button type="submit">Login</Button>
        </CardBody>
      </form>
      <Divider />
      <CardFooter className="flow-root">
        <div className="float-left">Don't have an account?</div>
        <Button className="float-right" onClick={signUp}>
          Sign up
        </Button>
      </CardFooter>
    </Card>
  );
}
