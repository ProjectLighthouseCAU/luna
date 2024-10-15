import { AuthAction, AuthResult } from '@luna/api/auth/AuthAction';

/**
 * A facility that talks to an authentication backend.
 */
export interface AuthApi {
  /** Performs an auth action. */
  perform<A extends AuthAction>(action: A): AuthResult<A>;
}
