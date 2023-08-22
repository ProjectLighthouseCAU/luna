import { DISPLAY_ASPECT_RATIO, Display } from '@luna/components/Display';
import { Card, CardFooter } from '@nextui-org/react';
import React from 'react';

interface DisplayCardProps {
  username: string;
  frame: Uint8Array;
  isSkeleton?: boolean;
}

export function DisplayCard({ username, frame, isSkeleton }: DisplayCardProps) {
  const displayWidth = 300;
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
