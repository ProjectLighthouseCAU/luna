import React, { useLayoutEffect, useRef } from 'react';
import {
  LIGHTHOUSE_COLOR_CHANNELS,
  LIGHTHOUSE_COLS,
  LIGHTHOUSE_ROWS,
} from 'nighthouse/browser';

export const DISPLAY_ASPECT_RATIO = 0.8634;

export interface DisplayProps {
  frame: Uint8Array;
  width?: number;
  rows?: number;
  columns?: number;
  aspectRatio?: number;
  relativeBezelWidth?: number;
  relativeGutterWidth?: number;
}

export function Display({
  frame,
  width: customWidth,
  rows = LIGHTHOUSE_ROWS,
  columns = LIGHTHOUSE_COLS,
  aspectRatio = DISPLAY_ASPECT_RATIO,
  relativeBezelWidth = 0.0183,
  relativeGutterWidth = 0.0064,
}: DisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Set up rendering
  useLayoutEffect(() => {
    const canvas = canvasRef.current!;
    const boundingWidth = canvasRef.current?.getBoundingClientRect().width;
    const ctx = canvas.getContext('2d')!;

    const newWidth = customWidth ?? boundingWidth;
    const newScaledWidth = newWidth ? newWidth * window.devicePixelRatio : null;

    canvas.width = newScaledWidth ?? canvas.width;
    canvas.height = canvas.width / aspectRatio;

    canvas.style.width = `${newWidth}px`;

    const width = canvas.width;
    const height = canvas.height;

    const bezelWidth = relativeBezelWidth * width;
    const gutterWidth = relativeGutterWidth * width;
    const gutterCount = columns + 1;
    const windowWidth =
      (width - 2 * bezelWidth - gutterCount * gutterWidth) / columns;
    const spacersPerRow = 1;
    const windowHeight = height / ((1 + spacersPerRow) * rows);

    // Draw bezels
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, bezelWidth, height);
    ctx.fillRect(width - bezelWidth, 0, bezelWidth, height);

    // Draw gutters
    ctx.fillStyle = 'gray';
    for (let j = 0; j < gutterCount; j++) {
      const x = bezelWidth + j * (windowWidth + gutterWidth);
      ctx.fillRect(x, 0, gutterWidth, height);
    }

    // Draw windows
    for (let j = 0; j < columns; j++) {
      const x = bezelWidth + j * windowWidth + (j + 1) * gutterWidth;

      for (let i = 0; i < rows; i++) {
        const y = i * (1 + spacersPerRow) * windowHeight;
        const k = (i * LIGHTHOUSE_ROWS + j) * LIGHTHOUSE_COLOR_CHANNELS;
        const rgb = frame.slice(k, k + LIGHTHOUSE_COLOR_CHANNELS);
        ctx.fillStyle = `rgb(${rgb.join(',')})`;
        ctx.fillRect(x, y, windowWidth, windowHeight);
      }
    }
  }, [
    customWidth,
    aspectRatio,
    frame,
    rows,
    columns,
    relativeBezelWidth,
    relativeGutterWidth,
  ]);

  return <canvas ref={canvasRef} />;
}
