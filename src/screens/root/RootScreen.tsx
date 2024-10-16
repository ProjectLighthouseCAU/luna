import { AuthContext } from '@luna/contexts/api/auth/AuthContext';
import { HomeScreen } from '@luna/screens/home/HomeScreen';
import { LoadingScreen } from '@luna/screens/loading/LoadingScreen';
import { LoginScreen } from '@luna/screens/login/LoginScreen';
import { useContext } from 'react';

export function RootScreen() {
  const auth = useContext(AuthContext);
  return !auth.isInitialized ? (
    <LoadingScreen />
  ) : auth.user !== null ? (
    <HomeScreen />
  ) : (
    <LoginScreen />
  );
}
