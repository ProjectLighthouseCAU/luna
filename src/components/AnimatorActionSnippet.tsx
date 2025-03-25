import { ColorSnippet } from '@luna/components/ColorSnippet';
import { AnimatorAction } from '@luna/contexts/displays/AnimatorContext';

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
    </div>
  );
}

function formatType(type: AnimatorAction['type']) {
  switch (type) {
    case 'setColor':
      return 'Set Color';
  }
}
