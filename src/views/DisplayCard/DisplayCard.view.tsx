import { Display } from '@luna/components/Display';
import { Card } from '@nextui-org/react';
import { LIGHTHOUSE_FRAME_BYTES } from 'nighthouse/browser';
import React from 'react';

export function DisplayCard() {
  const frame = new Uint8Array(LIGHTHOUSE_FRAME_BYTES);

  return (
    <Card>
      <Display frame={frame} />
    </Card>
  );
}
