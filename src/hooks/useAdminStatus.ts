import { AuthContext } from '@luna/contexts/api/auth/AuthContext';
import { useContext, useMemo } from 'react';

export function useAdminStatus() {
  const auth = useContext(AuthContext);

  const isAdmin = useMemo(
    () => auth.user?.roles.find(role => role.name === 'admin') !== undefined,
    [auth.user?.roles]
  );

  return { isAdmin };
}
