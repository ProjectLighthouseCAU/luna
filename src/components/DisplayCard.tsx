import { DISPLAY_ASPECT_RATIO } from '@luna/components/Display';
import { Card, CardFooter } from '@heroui/react';
import React, { memo } from 'react';
import { DisplayStream } from '@luna/screens/home/displays/DisplayStream';

interface DisplayCardProps {
  username: string;
  displayWidth: number;
  className?: string;
  isSkeleton?: boolean;
}

export const DisplayCard = memo(
  ({ username, displayWidth, className, isSkeleton }: DisplayCardProps) => {
    const displayHeight = displayWidth / DISPLAY_ASPECT_RATIO;

    return (
      <Card className={className}>
        {isSkeleton ? (
          <div style={{ width: displayWidth, height: displayHeight }} />
        ) : (
          <DisplayStream username={username} width={displayWidth} />
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
    prevProps.username === newProps.username
);
