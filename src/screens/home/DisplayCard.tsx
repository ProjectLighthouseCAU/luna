import { Display } from '@luna/components/Display';
import { Card, CardFooter } from '@nextui-org/react';
import { LIGHTHOUSE_FRAME_BYTES } from 'nighthouse/browser';
import React from 'react';

interface DisplayCardProps {
  username: string;
}

export function DisplayCard({ username }: DisplayCardProps) {
  const frame = new Uint8Array(LIGHTHOUSE_FRAME_BYTES);

  return (
    <Card>
      <Display frame={frame} />
      <CardFooter>{username}</CardFooter>
    </Card>
  );
}
