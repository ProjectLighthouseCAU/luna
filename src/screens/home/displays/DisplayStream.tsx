import { Display, DisplayProps } from '@luna/components/Display';
import { useModelStream } from '@luna/hooks/useModelStream';
import { useLayoutEffect } from 'react';

export interface DisplayStreamProps extends Omit<DisplayProps, 'frame'> {
  username: string;
  layoutOnModelUpdate?: () => void;
}

export function DisplayStream({
  username,
  layoutOnModelUpdate,
  ...displayProps
}: DisplayStreamProps) {
  const userModel = useModelStream(username);

  // Perform layout updates (e.g. resizing the canvas) after the model has been added
  useLayoutEffect(() => {
    if (userModel) {
      layoutOnModelUpdate?.();
    }
  }, [layoutOnModelUpdate, userModel]);

  return <Display frame={userModel.frame} {...displayProps} />;
}
