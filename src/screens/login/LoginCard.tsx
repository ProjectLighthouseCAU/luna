import { FormInput } from '@luna/components/FormInput';
import { AuthContext } from '@luna/contexts/api/auth/AuthContext';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
} from '@heroui/react';
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

  const resetError = useCallback(() => setErrorMessage(null), []);

  const isInvalid = errorMessage !== null;

  const logIn = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!username) {
        setErrorMessage('Please enter a username');
        return;
      }
      const loginResult = await auth.logIn({ username, password });
      if (!loginResult.ok) {
        setErrorMessage(loginResult.error);
        return;
      }
      navigate(`/displays/${username}`);
    },
    [auth, navigate, username, password]
  );

  const signUp = useCallback(async () => {
    showSignup();
  }, [showSignup]);

  return (
    <Card className="w-full">
      <form onSubmit={logIn}>
        <CardHeader>Log in to view and manage your displays</CardHeader>
        <Divider />
        <CardBody className="w-full space-y-6">
          <div className="space-y-2">
            <FormInput
              label="Username"
              setValue={setUsername}
              resetError={resetError}
              isInvalid={isInvalid}
            />
            <FormInput
              label="Password"
              type="password"
              setValue={setPassword}
              resetError={resetError}
              isInvalid={isInvalid}
              errorMessage={errorMessage}
            />
          </div>
          <Button type="submit">Log in</Button>
        </CardBody>
      </form>
      <Divider />
      <CardFooter className="flex justify-between">
        <div className="text-foreground-400">Don't have an account?</div>
        <Button onClick={signUp} size="sm" variant="flat">
          Sign up
        </Button>
      </CardFooter>
    </Card>
  );
}
