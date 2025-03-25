import { Progress } from '@heroui/react';
import { ColorSnippet } from '@luna/components/ColorSnippet';
import { AnimatorAction } from '@luna/contexts/displays/animator/types';

export interface AnimatorActionSnippetProps {
  action: AnimatorAction;
  displayProgress?: boolean;
  className?: string;
}

export function AnimatorActionSnippet({
  action,
  displayProgress = false,
  className = '',
}: AnimatorActionSnippetProps) {
  return (
    <div className={`flex flex-col ${className}`}>
      <div>{formatType(action.type)}</div>
      <AnimatorActionDetail action={action} />
      {displayProgress ? (
        <Progress
          aria-label="Animator action progress"
          size="sm"
          value={action.ticks.value}
          maxValue={action.ticks.total - 1}
          color="default"
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
  }
  return <></>;
}
