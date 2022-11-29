import React, { useEffect, useRef } from 'react';

const DEFAULT_ASPECT_RATIO = 0.8634;

export interface DisplayProps {
  display: Uint8Array;
  maxWidth: number;
  maxHeight: number;
  aspectRatio?: number;
}

export function Display(props: DisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;

    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, [props.maxWidth, props.maxHeight]);

  const aspectRatio = props.aspectRatio ?? DEFAULT_ASPECT_RATIO;
  const [width, height] =
    props.maxHeight <= props.maxWidth
      ? [aspectRatio * props.maxHeight, props.maxHeight]
      : [props.maxWidth, props.maxWidth / aspectRatio];

  return <canvas ref={canvasRef} width={width} height={height} />;
}
