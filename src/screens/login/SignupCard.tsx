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
  | 'generic';

interface SignupError {
  kind?: SignupErrorKind;
  message: string;
}

function errorProps({
  filter: { kind: kindFilter, message: messageFilter = new Set(['kind']) },
  error,
}: {
  filter: {
    kind: SignupErrorKind;
    message?: Set<'kind' | 'generic'>;
  };
  error: SignupError | null;
}) {
  const isGeneric = error?.kind === 'generic';
  const isKind = error?.kind === kindFilter;
  const isInvalid = isKind || isGeneric;
  return {
    isInvalid,
    errorMessage:
      (isKind && messageFilter.has('kind')) ||
      (isGeneric && messageFilter.has('generic'))
        ? error?.message
        : null,
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
      if (!/^\S+@\S+\.\S+$/.test(email)) {
        setError({
          kind: 'email',
          message: 'Please enter a valid email address',
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
      const signupResult = await auth.signUp({
        registrationKey,
        email,
        username,
        password,
      });
      if (!signupResult.ok) {
        setError({
          kind: 'generic',
          message: signupResult.error,
        });
        return;
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
      <form onSubmit={signUp} autoComplete="off">
        <CardHeader>Register for a new account</CardHeader>
        <Divider />
        <CardBody className="w-full space-y-6">
          <div className="space-y-2">
            <FormInput
              label="Registration Key"
              tooltip="You need a valid registration key to sign up. Ask your tutor or a member of the Lighthouse team for one."
              setValue={setRegistrationKey}
              resetError={resetError}
              {...errorProps({ filter: { kind: 'registrationKey' }, error })}
            />
            <FormInput
              label="E-Mail"
              tooltip="Please provide an email address, e.g. stu123456@mail.uni-kiel.de"
              setValue={setEmail}
              resetError={resetError}
              {...errorProps({ filter: { kind: 'email' }, error })}
            />
            <FormInput
              label="Username"
              tooltip="Doesn't have to be your student number. Be creative, but nothing inappropriate please!"
              setValue={setUsername}
              resetError={resetError}
              {...errorProps({ filter: { kind: 'username' }, error })}
            />
            <FormInput
              label="Password"
              type="password"
              tooltip="Please use a secure password of sufficient length. Your password is stored securely, trust me ;)"
              setValue={setPassword}
              resetError={resetError}
              {...errorProps({
                filter: { kind: 'password', message: new Set() },
                error,
              })}
            />
            <FormInput
              label="Repeat Password"
              type="password"
              tooltip="You know, just to make sure you haven't made an oopsie"
              setValue={setRepeatedPassword}
              resetError={resetError}
              {...errorProps({
                filter: {
                  kind: 'password',
                  message: new Set(['kind', 'generic']),
                },
                error,
              })}
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
