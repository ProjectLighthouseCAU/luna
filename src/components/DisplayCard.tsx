import { DISPLAY_ASPECT_RATIO, Display } from '@luna/components/Display';
import { Card, CardFooter } from '@heroui/react';
import React, { memo } from 'react';

interface DisplayCardProps {
  username: string;
  frame: Uint8Array;
  displayWidth: number;
  className?: string;
  isSkeleton?: boolean;
}

export const DisplayCard = memo(
  ({
    username,
    frame,
    displayWidth,
    className,
    isSkeleton,
  }: DisplayCardProps) => {
    const displayHeight = displayWidth / DISPLAY_ASPECT_RATIO;

    return (
      <Card className={className}>
        {isSkeleton ? (
          <div style={{ width: displayWidth, height: displayHeight }} />
        ) : (
          <Display frame={frame} width={displayWidth} />
        )}
        <CardFooter className="truncate" style={{ width: displayWidth }}>
          {username}
        </CardFooter>
      </Card>
    );
  },
  (prevProps, newProps) =>
    prevProps.isSkeleton === newProps.isSkeleton &&
    prevProps.className === newProps.className &&
    prevProps.displayWidth === newProps.displayWidth &&
    prevProps.username === newProps.username &&
    prevProps.frame.toString() === newProps.frame.toString()
);
