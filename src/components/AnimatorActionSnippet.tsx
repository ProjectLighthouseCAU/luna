import { Progress } from '@heroui/react';
import { ColorSnippet } from '@luna/components/ColorSnippet';
import { AnimatorAction } from '@luna/contexts/displays/animator/types';

export interface AnimatorActionSnippetProps {
  action: AnimatorAction;
  className?: string;
}

export function AnimatorActionSnippet({
  action,
  className = '',
}: AnimatorActionSnippetProps) {
  return (
    <div className={`flex flex-col ${className}`}>
      <div>{formatType(action.type)}</div>
      <ColorSnippet color={action.color} />
      <Progress
        aria-label="Animator action progress"
        size="sm"
        value={action.ticks.value}
        maxValue={action.ticks.total - 1}
        color="default"
      />
    </div>
  );
}

function formatType(type: AnimatorAction['type']) {
  switch (type) {
    case 'setColor':
      return 'Set Color';
  }
}
