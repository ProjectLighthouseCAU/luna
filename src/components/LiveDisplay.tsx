import { Display } from '@luna/components/Display';
import { LIGHTHOUSE_FRAME_BYTES } from 'nighthouse/browser';
import React from 'react';

export interface LiveDisplayProps {
  width?: number;
}

export function LiveDisplay({ width }: LiveDisplayProps) {
  // TODO: Display live lighthouse display

  return (
    <Display width={width} frame={new Uint8Array(LIGHTHOUSE_FRAME_BYTES)} />
  );
}
