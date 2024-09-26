import { FormInput } from '@luna/components/FormInput';
import { AuthContext } from '@luna/contexts/AuthContext';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
} from '@nextui-org/react';
import { FormEvent, useCallback, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export interface SignupCardProps {
  showLogin: () => void;
}

type SignupErrorKind =
  | 'registrationKey'
  | 'email'
  | 'username'
  | 'password'
  | 'serverError';

interface SignupError {
  kind?: SignupErrorKind;
  message: string;
}

function errorProps({
  kind,
  showMessage = true,
  error,
}: {
  kind: SignupErrorKind;
  showMessage?: boolean;
  error: SignupError | null;
}) {
  const isInvalid = error?.kind === kind;
  return {
    isInvalid,
    errorMessage: showMessage && isInvalid ? error?.message : null,
  };
}

export function SignupCard({ showLogin }: SignupCardProps) {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const [registrationKey, setRegistrationKey] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [repeatedPassword, setRepeatedPassword] = useState('');
  const [error, setError] = useState<SignupError | null>(null);

  const resetError = useCallback(() => setError(null), []);

  const signUp = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!registrationKey) {
        setError({
          kind: 'registrationKey',
          message: 'Please enter a registration key',
        });
        return;
      }
      if (!email) {
        setError({
          kind: 'email',
          message: 'Please enter an email address',
        });
        return;
      }
      if (!username) {
        setError({
          kind: 'username',
          message: 'Please enter a username',
        });
        return;
      }
      if (!password) {
        setError({
          kind: 'password',
          message: 'Please enter a password',
        });
        return;
      }
      if (password !== repeatedPassword) {
        setError({
          kind: 'password',
          message: 'Passwords do not match',
        });
        return;
      }
      if (
        !(await auth.signUp({ registrationKey, email, username, password }))
      ) {
        setError({
          kind: 'serverError',
          message: 'Could not sign up',
        });
      }
      navigate('/displays');
    },
    [
      auth,
      navigate,
      registrationKey,
      email,
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
        <CardHeader>Register for a new account</CardHeader>
        <Divider />
        <CardBody className="w-full space-y-6">
          <div className="space-y-2">
            <FormInput
              label="Registration Key"
              tooltip="You need a valid registration key to sign up. Ask your tutor or a member of the Lighthouse team for one."
              setValue={setRegistrationKey}
              resetError={resetError}
              {...errorProps({ kind: 'registrationKey', error })}
            />
            <FormInput
              label="E-Mail"
              tooltip="Please provide an email address, e.g. stu123456@mail.uni-kiel.de"
              setValue={setEmail}
              resetError={resetError}
              {...errorProps({ kind: 'email', error })}
            />
            <FormInput
              label="Username"
              tooltip="Doesn't have to be your student number. Be creative, but nothing inappropriate please!"
              setValue={setUsername}
              resetError={resetError}
              {...errorProps({ kind: 'username', error })}
            />
            <FormInput
              label="Password"
              type="password"
              tooltip="Please use a secure password of sufficient length. Your password is stored securely, trust me ;)"
              setValue={setPassword}
              resetError={resetError}
              {...errorProps({ kind: 'password', showMessage: false, error })}
            />
            <FormInput
              label="Repeat Password"
              type="password"
              tooltip="You know, just to make sure you haven't made an oopsie"
              setValue={setRepeatedPassword}
              resetError={resetError}
              {...errorProps({ kind: 'password', error })}
            />
          </div>
          <Button type="submit">Sign up</Button>
        </CardBody>
      </form>
      <Divider />
      <CardFooter className="flex justify-between">
        <div className="text-foreground-400">Already have an account?</div>
        <Button onClick={logIn} size="sm" variant="flat">
          Log in
        </Button>
      </CardFooter>
    </Card>
  );
}
