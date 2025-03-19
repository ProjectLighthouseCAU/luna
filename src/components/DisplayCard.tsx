import { DISPLAY_ASPECT_RATIO } from '@luna/components/Display';
import { Card, CardFooter } from '@heroui/react';
import React, { memo } from 'react';
import { DisplayStream } from '@luna/screens/home/displays/DisplayStream';
import { DisplayPin } from '@luna/hooks/usePinnedDisplays';
import { DisplayPinLabel } from '@luna/components/DisplayPinLabel';

interface DisplayCardProps {
  username: string;
  displayWidth: number;
  className?: string;
  pin?: DisplayPin;
  isSkeleton?: boolean;
}

export const DisplayCard = memo(
  ({
    username,
    displayWidth,
    className,
    pin,
    isSkeleton,
  }: DisplayCardProps) => {
    const displayHeight = displayWidth / DISPLAY_ASPECT_RATIO;

    return (
      <Card className={className}>
        {isSkeleton ? (
          <div style={{ width: displayWidth, height: displayHeight }} />
        ) : (
          <DisplayStream username={username} width={displayWidth} />
        )}
        <CardFooter
          className="flex flex-row gap-2 truncate"
          style={{ width: displayWidth }}
        >
          {username}
          {pin && !isSkeleton ? <DisplayPinLabel pin={pin} /> : undefined}
        </CardFooter>
      </Card>
    );
  },
  (prevProps, newProps) =>
    JSON.stringify(prevProps) === JSON.stringify(newProps)
);
