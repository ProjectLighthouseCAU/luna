import { DISPLAY_ASPECT_RATIO, Display } from '@luna/components/Display';
import { Card, CardFooter } from '@nextui-org/react';
import React from 'react';

interface DisplayCardProps {
  username: string;
  frame: Uint8Array;
  displayWidth: number;
  isSkeleton?: boolean;
}

export function DisplayCard({
  username,
  frame,
  displayWidth,
  isSkeleton,
}: DisplayCardProps) {
  const displayHeight = displayWidth / DISPLAY_ASPECT_RATIO;

  return (
    <Card>
      {isSkeleton ? (
        <div style={{ width: displayWidth, height: displayHeight }} />
      ) : (
        <Display frame={frame} width={displayWidth} />
      )}
      <CardFooter>{username}</CardFooter>
    </Card>
  );
}
