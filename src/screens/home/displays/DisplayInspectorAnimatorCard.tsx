import { Button, Popover, PopoverContent, PopoverTrigger } from '@heroui/react';
import { AnimatorActionSnippet } from '@luna/components/AnimatorActionSnippet';
import { Hint } from '@luna/components/Hint';
import { SimpleEditForm } from '@luna/components/SimpleEditForm';
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
  IconPlayerPlayFilled,
  IconPlayerSkipBackFilled,
  IconPlayerSkipForwardFilled,
  IconTrash,
} from '@tabler/icons-react';
import { useCallback, useContext, useState } from 'react';

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

  const [animator, updateAnimator] = useAnimator({ username });

  const [isScrollingTextModalOpen, setScrollingTextModalOpen] = useState(false);

  const addAction = useCallback(
    (action: AnimatorAction) => {
      updateAnimator({ type: 'addAction', action });
    },
    [updateAnimator]
  );

  const clearQueue = useCallback(() => {
    updateAnimator({ type: 'clearQueue' });
  }, [updateAnimator]);

  const skipBack = useCallback(() => {
    updateAnimator({ type: 'skipAction', direction: 'back' });
  }, [updateAnimator]);

  const skipForward = useCallback(() => {
    updateAnimator({ type: 'skipAction', direction: 'forward' });
  }, [updateAnimator]);

  const play = useCallback(() => {
    updateAnimator({ type: 'setPlaying', isPlaying: true });
  }, [updateAnimator]);

  const pause = useCallback(() => {
    updateAnimator({ type: 'setPlaying', isPlaying: false });
  }, [updateAnimator]);

  const setPlaying = useCallback(
    (isPlaying: boolean) => {
      updateAnimator({ type: 'setPlaying', isPlaying });
    },
    [updateAnimator]
  );

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

  const addScrollingText = useCallback(
    (text: string) => {
      addAction({
        type: 'scrollText',
        id: randomUUID(),
        ticks: {
          value: 0,
          total: 5 * text.length,
        },
        text,
      });
      setScrollingTextModalOpen(false);
    },
    [addAction]
  );

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

  const blackout = useCallback(() => {
    addAction({
      type: 'setColor',
      id: randomUUID(),
      ticks: {
        value: 0,
        total: 1,
      },
      color: rgb.BLACK,
    });
  }, [addAction]);

  const scrubAnimator = useCallback(
    (ticks: number) => {
      updateAnimator({ type: 'scrub', ticks });
    },
    [updateAnimator]
  );

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
            <Popover
              placement="left"
              showArrow
              isOpen={isScrollingTextModalOpen}
              onOpenChange={setScrollingTextModalOpen}
            >
              <PopoverTrigger>
                <Button size="sm" variant="ghost">
                  Scrolling Text
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <SimpleEditForm onSubmit={addScrollingText} />
              </PopoverContent>
            </Popover>
            <Button onPress={addSleep} size="sm" variant="ghost">
              Sleep
            </Button>
            <Button onPress={blackout} size="sm" variant="ghost">
              Blackout
            </Button>
          </div>
          <div className="flex flex-row justify-between">
            {/* TODO: Implement the disabled actions */}
            <Button isIconOnly size="sm" variant="light" onPress={skipBack}>
              <IconPlayerSkipBackFilled />
            </Button>
            <Button
              isIconOnly
              size="sm"
              variant="light"
              onPress={animator.isPlaying ? pause : play}
            >
              {animator.isPlaying ? (
                <IconPlayerPauseFilled />
              ) : (
                <IconPlayerPlayFilled />
              )}
            </Button>
            <Button isIconOnly size="sm" variant="light" onPress={skipForward}>
              <IconPlayerSkipForwardFilled />
            </Button>
            <Button isIconOnly size="sm" variant="light" onPress={clearQueue}>
              <IconTrash />
            </Button>
          </div>
          <div className="flex flex-col">
            {/* TODO: Make this list reorderable via drag-n-drop */}
            {animator.queue.length > 0 ? (
              animator.queue.map((action, i) => (
                <AnimatorActionSnippet
                  key={action.id}
                  action={action}
                  displayProgress={i === 0}
                  scrubProgress={scrubAnimator}
                  isPlaying={animator.isPlaying}
                  setPlaying={setPlaying}
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
