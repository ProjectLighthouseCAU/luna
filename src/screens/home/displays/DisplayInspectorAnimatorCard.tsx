import { Button } from '@heroui/react';
import { AnimatorActionSnippet } from '@luna/components/AnimatorActionSnippet';
import { Hint } from '@luna/components/Hint';
import { TitledCard } from '@luna/components/TitledCard';
import { LocalStorageKey } from '@luna/constants/LocalStorageKey';
import { AuthContext } from '@luna/contexts/api/auth/AuthContext';
import { AnimatorAction } from '@luna/contexts/displays/animator/types';
import { ColorSchemeContext } from '@luna/contexts/env/ColorSchemeContext';
import { useAdminStatus } from '@luna/hooks/useAdminStatus';
import { useAnimator } from '@luna/hooks/useAnimator';
import { useLocalStorage } from '@luna/hooks/useLocalStorage';
import * as rgb from '@luna/utils/rgb';
import { randomUUID } from '@luna/utils/uuid';
import {
  IconMovie,
  IconPlayerPauseFilled,
  IconPlayerSkipBackFilled,
  IconPlayerSkipForwardFilled,
  IconTrash,
} from '@tabler/icons-react';
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

  const { colorScheme } = useContext(ColorSchemeContext);

  const [isCollapsed, storeCollapsed] = useLocalStorage(
    LocalStorageKey.DisplayInspectorAnimatorCollapsed,
    () => false
  );

  const [animator, setAnimator] = useAnimator({ username });

  const addAction = useCallback(
    (action: AnimatorAction) => {
      setAnimator({ ...animator, queue: [...animator.queue, action] });
    },
    [animator, setAnimator]
  );

  const clearQueue = useCallback(() => {
    setAnimator({ ...animator, queue: [] });
  }, [animator, setAnimator]);

  const addRandomColor = useCallback(() => {
    addAction({
      type: 'setColor',
      id: randomUUID(),
      ticks: {
        value: 0,
        total: 5,
      },
      color: rgb.random(),
    });
  }, [addAction]);

  const addSleep = useCallback(() => {
    addAction({
      type: 'sleep',
      id: randomUUID(),
      ticks: {
        value: 0,
        total: 5,
      },
    });
  }, [addAction]);

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
          <div className="flex flex-col gap-1.5">
            <Button onPress={addRandomColor} size="sm" variant="ghost">
              Random Color
            </Button>
            <Button onPress={addSleep} size="sm" variant="ghost">
              Sleep
            </Button>
          </div>
          <div className="flex flex-row justify-between">
            {/* TODO: Implement the disabled actions */}
            <Button isIconOnly size="sm" variant="light" isDisabled>
              <IconPlayerSkipBackFilled />
            </Button>
            <Button isIconOnly size="sm" variant="light" isDisabled>
              <IconPlayerPauseFilled />
            </Button>
            <Button isIconOnly size="sm" variant="light" isDisabled>
              <IconPlayerSkipForwardFilled />
            </Button>
            <Button isIconOnly size="sm" variant="light" onPress={clearQueue}>
              <IconTrash />
            </Button>
          </div>
          <div className="flex flex-col">
            {/* TODO: Make this list reorderable via drag-n-drop */}
            {animator.queue.length > 0 ? (
              animator.queue.map(action => (
                <AnimatorActionSnippet
                  key={action.id}
                  action={action}
                  className={`select-none p-1 rounded ${colorScheme.isDark ? 'even:bg-neutral-800' : 'even:bg-neutral-200'}`}
                />
              ))
            ) : (
              <Hint>no items queued</Hint>
            )}
          </div>
        </div>
      ) : (
        <Hint>only available for your own view</Hint>
      )}
    </TitledCard>
  );
}
