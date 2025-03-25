import { Hint } from '@luna/components/Hint';
import { TitledCard } from '@luna/components/TitledCard';
import { LocalStorageKey } from '@luna/constants/LocalStorageKey';
import { AuthContext } from '@luna/contexts/api/auth/AuthContext';
import { useAdminStatus } from '@luna/hooks/useAdminStatus';
import { useLocalStorage } from '@luna/hooks/useLocalStorage';
import { IconMovie } from '@tabler/icons-react';
import { useContext } from 'react';

export interface DisplayInspectorAnimatorCardProps {
  username: string;
}

export function DisplayInspectorAnimatorCard({
  username,
}: DisplayInspectorAnimatorCardProps) {
  const { user: me } = useContext(AuthContext);
  const { isAdmin } = useAdminStatus();
  const isMeOrAdmin = username === me?.username || isAdmin;

  const [isCollapsed, storeCollapsed] = useLocalStorage(
    LocalStorageKey.DisplayInspectorAnimatorCollapsed,
    () => false
  );

  return (
    <TitledCard
      icon={<IconMovie />}
      title="Animator"
      isCollapsible
      initiallyCollapsed={isCollapsed}
      onSetCollapsed={storeCollapsed}
    >
      {isMeOrAdmin ? <>TODO</> : <Hint>only available for your own view</Hint>}
    </TitledCard>
  );
}
