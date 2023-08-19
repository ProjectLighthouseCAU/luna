import { Display } from '@luna/components/Display';
import { Card, CardFooter } from '@nextui-org/react';
import React from 'react';

interface DisplayCardProps {
  username: string;
  frame: Uint8Array;
}

export function DisplayCard({ username, frame }: DisplayCardProps) {
  return (
    <Card>
      <Display frame={frame} />
      <CardFooter>{username}</CardFooter>
    </Card>
  );
}
