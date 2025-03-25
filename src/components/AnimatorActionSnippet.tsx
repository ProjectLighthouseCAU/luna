import { Slider } from '@heroui/react';
import { ColorSnippet } from '@luna/components/ColorSnippet';
import { AnimatorAction } from '@luna/contexts/displays/animator/types';
import { useCallback, useState } from 'react';

export interface AnimatorActionSnippetProps {
  action: AnimatorAction;
  displayProgress?: boolean;
  scrubProgress?: (ticks: number) => void;
  isPlaying: boolean;
  setPlaying?: (isPlaying: boolean) => void;
  className?: string;
}

export function AnimatorActionSnippet({
  action,
  displayProgress = false,
  scrubProgress,
  isPlaying,
  setPlaying,
  className = '',
}: AnimatorActionSnippetProps) {
  const [isScrubbing, setScrubbing] = useState(false);
  const [wasPlaying, setWasPlaying] = useState<boolean>();

  const onChangeProgress = useCallback(
    (value: number | number[]) => {
      if (typeof value === 'number' && scrubProgress) {
        if (!isScrubbing) {
          setScrubbing(true);
          setWasPlaying(isPlaying);
          setPlaying?.(false);
        }
        scrubProgress(value);
      }
    },
    [isPlaying, isScrubbing, scrubProgress, setPlaying]
  );

  const onChangeEndProgress = useCallback(() => {
    if (isScrubbing && wasPlaying !== undefined) {
      setPlaying?.(wasPlaying);
      setWasPlaying(undefined);
    }
  }, [isScrubbing, setPlaying, wasPlaying]);

  return (
    <div className={`flex flex-col ${className}`}>
      <div>{formatType(action.type)}</div>
      <AnimatorActionDetail action={action} />
      {displayProgress ? (
        <Slider
          aria-label="Animator action progress"
          size="sm"
          value={action.ticks.value}
          maxValue={action.ticks.total - 1}
          onChange={onChangeProgress}
          onChangeEnd={onChangeEndProgress}
          color="foreground"
          className="mt-1"
        />
      ) : null}
    </div>
  );
}

function formatType(type: AnimatorAction['type']): string {
  switch (type) {
    case 'setColor':
      return 'Set Color';
    case 'scrollText':
      return 'Scroll Text';
    case 'sleep':
      return 'Sleep';
  }
}

function AnimatorActionDetail({ action }: { action: AnimatorAction }) {
  switch (action.type) {
    case 'setColor':
      return <ColorSnippet color={action.color} />;
    case 'scrollText':
      return <div className="opacity-50">{action.text}</div>;
  }
  return <></>;
}
