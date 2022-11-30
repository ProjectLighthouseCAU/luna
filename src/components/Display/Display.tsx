import React, { useEffect, useRef } from 'react';
import {
  LIGHTHOUSE_COLOR_CHANNELS,
  LIGHTHOUSE_COLS,
  LIGHTHOUSE_ROWS,
} from 'nighthouse/browser';

export interface DisplayProps {
  frame: Uint8Array;
  maxWidth: number;
  maxHeight: number;
  rows?: number;
  columns?: number;
  aspectRatio?: number;
  relativeBezelWidth?: number;
  relativeGutterWidth?: number;
}

export function Display({
  frame,
  maxWidth,
  maxHeight,
  rows = LIGHTHOUSE_ROWS,
  columns = LIGHTHOUSE_COLS,
  aspectRatio = 0.8634,
  relativeBezelWidth = 0.0183,
  relativeGutterWidth = 0.0064,
}: DisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Set up layout
  const [width, height] =
    maxHeight <= maxWidth
      ? [aspectRatio * maxHeight, maxHeight]
      : [maxWidth, maxWidth / aspectRatio];

  // Set up rendering
  useEffect(() => {
    console.log('Drawing display');

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;

    const bezelWidth = relativeBezelWidth * width;
    const gutterWidth = relativeGutterWidth * width;
    const windowWidth = (width - 2 * bezelWidth) / columns - gutterWidth;
    const spacersPerRow = 1;
    const windowHeight = height / ((1 + spacersPerRow) * rows);

    // Draw bezels
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, bezelWidth, height);
    ctx.fillRect(width - bezelWidth, 0, bezelWidth, height);

    for (let j = 0; j < columns; j++) {
      const x = bezelWidth + j * (windowWidth + gutterWidth);

      // Draw windows
      for (let i = 0; i < rows; i++) {
        const y = i * (1 + spacersPerRow) * windowHeight;
        const k = (i * LIGHTHOUSE_ROWS + j) * LIGHTHOUSE_COLOR_CHANNELS;
        const rgb = frame.slice(k, k + LIGHTHOUSE_COLOR_CHANNELS);
        ctx.fillStyle = `rgb(${rgb.join(',')})`;
        ctx.fillRect(x, y, windowWidth, windowHeight);
      }

      // Draw gutter
      ctx.fillStyle = 'gray';
      ctx.fillRect(x, 0, gutterWidth, height);
    }
  }, [
    width,
    height,
    frame,
    rows,
    columns,
    relativeBezelWidth,
    relativeGutterWidth,
  ]);

  return <canvas ref={canvasRef} width={width} height={height} />;
}
