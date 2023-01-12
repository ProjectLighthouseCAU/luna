import { Display } from '@luna/components/Display';
import { LIGHTHOUSE_FRAME_BYTES } from 'nighthouse/browser';
import React from 'react';

export interface LiveDisplayProps {
  maxWidth: number;
  maxHeight: number;
}

export function LiveDisplay({ maxWidth, maxHeight }: LiveDisplayProps) {
  // TODO: Display live lighthouse display

  return (
    <Display
      maxWidth={maxWidth}
      maxHeight={maxHeight}
      frame={new Uint8Array(LIGHTHOUSE_FRAME_BYTES)}
    />
  );
}
