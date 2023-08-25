import { AuthContext } from '@luna/contexts/AuthContext';
import { HomeScreen } from '@luna/screens/home/HomeScreen';
import { LoginScreen } from '@luna/screens/login/LoginScreen';
import { useContext } from 'react';

export function RootScreen() {
  const auth = useContext(AuthContext);
  return auth.user !== null ? <HomeScreen /> : <LoginScreen />;
}
