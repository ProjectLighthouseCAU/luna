import React, { useEffect, useRef } from 'react';

const DEFAULT_ASPECT_RATIO = 0.8634;

export interface DisplayProps {
  display: Uint8Array;
  maxWidth: number;
  maxHeight: number;
  aspectRatio?: number;
}

export function Display({
  display,
  maxWidth,
  maxHeight,
  aspectRatio = DEFAULT_ASPECT_RATIO,
}: DisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;

    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, [maxWidth, maxHeight]);

  const [width, height] =
    maxHeight <= maxWidth
      ? [aspectRatio * maxHeight, maxHeight]
      : [maxWidth, maxWidth / aspectRatio];

  return <canvas ref={canvasRef} width={width} height={height} />;
}
