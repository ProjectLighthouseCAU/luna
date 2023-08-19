import { AuthContext } from '@luna/contexts/AuthContext';
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';

export function RootScreen() {
  const auth = useContext(AuthContext);
  return <Navigate to={auth.token ? '/home' : '/login'} />;
}
