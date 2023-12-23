import { AuthContext } from '@luna/contexts/AuthContext';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Input,
  Tooltip,
} from '@nextui-org/react';
import { FormEvent, useCallback, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export interface SignupCardProps {
  showLogin: () => void;
}

export function SignupCard({ showLogin }: SignupCardProps) {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const [registrationKey, setRegistrationKey] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [repeatedPassword, setRepeatedPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const signUp = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!registrationKey) {
        setErrorMessage('Please enter a registration key');
        return;
      }
      if (!username) {
        setErrorMessage('Please enter a username');
        return;
      }
      if (!password) {
        setErrorMessage('Please enter a password');
        return;
      }
      if (password !== repeatedPassword) {
        setErrorMessage('Passwords do not match');
        return;
      }
      if (!(await auth.client.signUp(registrationKey, username, password))) {
        setErrorMessage('Could not sign up');
      }
      navigate('/displays');
    },
    [
      auth.client,
      navigate,
      registrationKey,
      username,
      password,
      repeatedPassword,
    ]
  );

  const logIn = useCallback(async () => {
    showLogin();
  }, [showLogin]);

  return (
    <Card className="w-full">
      <form onSubmit={signUp}>
        <CardHeader>Register a new account</CardHeader>
        <Divider />
        <CardBody className="w-full space-y-6">
          <div className="space-y-2">
            <Tooltip
              placement="left"
              offset={16}
              content={
                <div className="text-center">
                  <div>You need a valid registration key to sign up. </div>
                  <div>Ask your tutor or a Lighthouse team member for one.</div>
                </div>
              }
            >
              <Input
                size="sm"
                label="Registration Key"
                aria-label="Registration Key"
                onValueChange={registrationKey => {
                  setRegistrationKey(registrationKey);
                  setErrorMessage(null);
                }}
                validationState={errorMessage ? 'invalid' : 'valid'}
              />
            </Tooltip>
            <Tooltip
              placement="left"
              offset={16}
              content={
                <div className="text-center">
                  <div>Doesn't have to be your student number</div>
                  <div>Be creative but nothing inappropriate please</div>
                </div>
              }
            >
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
            </Tooltip>
            <Tooltip
              placement="left"
              offset={16}
              content={
                <div className="text-center">
                  <div>Please use a secure password of sufficient length</div>
                  <div>Your password is stored securely, trust me ;)</div>
                </div>
              }
            >
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
              />
            </Tooltip>
            <Tooltip
              placement="left"
              offset={16}
              content={
                <div className="text-center">
                  You know, just to make sure you haven't made an oopsie
                </div>
              }
            >
              <Input
                size="sm"
                label="Repeat Password"
                aria-label="Repeat Password"
                type="password"
                onValueChange={password => {
                  setRepeatedPassword(password);
                  setErrorMessage(null);
                }}
                validationState={errorMessage ? 'invalid' : 'valid'}
                errorMessage={errorMessage}
              />
            </Tooltip>
          </div>
          <Button type="submit">Sign up</Button>
        </CardBody>
      </form>
      <Divider />
      <CardFooter className="flow-root">
        <div className="float-left text-align">Already have an account?</div>
        <Button className="float-right" onClick={logIn}>
          Login
        </Button>
      </CardFooter>
    </Card>
  );
}
