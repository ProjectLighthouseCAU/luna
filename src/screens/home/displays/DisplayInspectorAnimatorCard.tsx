import { Button } from '@heroui/react';
import { Hint } from '@luna/components/Hint';
import { TitledCard } from '@luna/components/TitledCard';
import { LocalStorageKey } from '@luna/constants/LocalStorageKey';
import { AuthContext } from '@luna/contexts/api/auth/AuthContext';
import { AnimatorAction } from '@luna/contexts/displays/AnimatorContext';
import { useAdminStatus } from '@luna/hooks/useAdminStatus';
import { useAnimator } from '@luna/hooks/useAnimator';
import { useLocalStorage } from '@luna/hooks/useLocalStorage';
import { GREEN } from '@luna/utils/rgb';
import { randomUUID } from '@luna/utils/uuid';
import { IconMovie } from '@tabler/icons-react';
import { useCallback, useContext } from 'react';

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

  const [animator, setAnimator] = useAnimator({ username });

  const pushAction = useCallback(
    (action: AnimatorAction) => {
      setAnimator({ ...animator, queue: [...animator.queue, action] });
    },
    [animator, setAnimator]
  );

  const addSetColor = useCallback(() => {
    pushAction({
      type: 'setColor',
      id: randomUUID(),
      color: GREEN,
    });
  }, [pushAction]);

  return (
    <TitledCard
      icon={<IconMovie />}
      title="Animator"
      isCollapsible
      initiallyCollapsed={isCollapsed}
      onSetCollapsed={storeCollapsed}
    >
      {isMeOrAdmin ? (
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            {animator.queue.length > 0 ? (
              animator.queue.map(item => <div>{item.type}</div>)
            ) : (
              <Hint>no items queued</Hint>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <Button onPress={addSetColor} size="sm" variant="ghost">
              Set Color
            </Button>
          </div>
        </div>
      ) : (
        <Hint>only available for your own view</Hint>
      )}
    </TitledCard>
  );
}
