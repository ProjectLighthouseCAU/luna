import React, { useLayoutEffect, useRef, useState } from 'react';
import {
  LIGHTHOUSE_COLOR_CHANNELS,
  LIGHTHOUSE_COLS,
  LIGHTHOUSE_ROWS,
} from 'nighthouse/browser';

export const DISPLAY_ASPECT_RATIO = 0.8634;

export interface MousePos {
  x: number;
  y: number;
}

export interface DisplayProps {
  frame: Uint8Array;
  width?: number;
  rows?: number;
  columns?: number;
  aspectRatio?: number;
  relativeBezelWidth?: number;
  relativeGutterWidth?: number;
  className?: string;
  strictBoundsChecking?: boolean;
  onMouseDown?: (p: MousePos) => void;
  onMouseUp?: (p: MousePos) => void;
  onMouseDrag?: (p: MousePos) => void;
}

export function Display({
  frame,
  width: customWidth,
  rows = LIGHTHOUSE_ROWS,
  columns = LIGHTHOUSE_COLS,
  aspectRatio = DISPLAY_ASPECT_RATIO,
  relativeBezelWidth = 0.0183,
  relativeGutterWidth = 0.0064,
  className,
  strictBoundsChecking = false,
  onMouseDown = (p: MousePos) => {},
  onMouseUp = (p: MousePos) => {},
  onMouseDrag = (p: MousePos) => {},
}: DisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [drag, setDrag] = useState(false);
  const [prevCoords, setPrevCoords] = useState<number[] | null>(null);
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

    // Draw background
    ctx.fillStyle = 'rgb(50,50,50)';
    ctx.fillRect(0, 0, width, height);

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

    const midPoints: number[][] = [];
    // Draw windows
    for (let j = 0; j < columns; j++) {
      const x = bezelWidth + j * windowWidth + (j + 1) * gutterWidth;

      for (let i = 0; i < rows; i++) {
        const y = i * (1 + spacersPerRow) * windowHeight;
        midPoints.push([x + windowWidth / 2, y + windowHeight / 2]);
        const k = (i * LIGHTHOUSE_COLS + j) * LIGHTHOUSE_COLOR_CHANNELS;
        const rgb = frame.slice(k, k + LIGHTHOUSE_COLOR_CHANNELS);
        ctx.fillStyle = `rgb(${rgb.join(',')})`;
        ctx.fillRect(x, y, windowWidth, windowHeight);
      }
    }

    const dist = ([x1, y1]: number[], [x2, y2]: number[]) => {
      const xDiff = x1 - x2;
      const yDiff = y1 - y2;
      return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
    };

    const mouseToWindowCoords = (mouseCoords: number[]) => {
      const closestPointIdx = midPoints
        .map(p => dist(p, mouseCoords))
        .reduce(
          ([aIdx, acc], val, idx) => [
            val < acc ? idx : aIdx,
            Math.min(acc, val),
          ],
          [-1, Infinity]
        )[0];
      const closestPoint = midPoints[closestPointIdx];
      const x = closestPoint[0] - windowWidth / 2;
      const y = closestPoint[1] - windowHeight / 2;
      if (
        strictBoundsChecking &&
        !(
          mouseCoords[0] >= x &&
          mouseCoords[0] <= x + windowWidth &&
          mouseCoords[1] >= y &&
          mouseCoords[1] <= y + windowHeight
        )
      ) {
        return null;
      }
      const j = Math.round(
        (x - bezelWidth - gutterWidth) / (windowWidth + gutterWidth)
      );
      const i = Math.round(y / (windowHeight * (1 + spacersPerRow)));
      return [i, j];
    };

    const onMouseDownHandler = (event: MouseEvent) => {
      setDrag(true);

      const rect = canvas.getBoundingClientRect();
      const mouseCoords = [event.clientX - rect.left, event.clientY - rect.top];

      const windowCoords = mouseToWindowCoords(mouseCoords);
      if (!windowCoords) return; // in case of strict bounds checking
      setPrevCoords(windowCoords); // for consecutive drag

      onMouseDown({ x: windowCoords[1], y: windowCoords[0] });
    };
    const onMouseUpHandler = (event: MouseEvent) => {
      setDrag(false);

      const rect = canvas.getBoundingClientRect();
      const mouseCoords = [event.clientX - rect.left, event.clientY - rect.top];

      const windowCoords = mouseToWindowCoords(mouseCoords);
      if (!windowCoords) return; // in case of strict bounds checking
      setPrevCoords(windowCoords); // for consecutive drag

      onMouseUp({ x: windowCoords[1], y: windowCoords[0] });
    };

    const onMouseDragHandler = (event: MouseEvent) => {
      if (!drag) return;
      const rect = canvas.getBoundingClientRect();
      const mouseCoords = [event.clientX - rect.left, event.clientY - rect.top];

      const windowCoords = mouseToWindowCoords(mouseCoords);
      if (!windowCoords) return; // in case of strict bounds checking

      // don't emit drag events if coords haven't changed
      if (
        prevCoords &&
        prevCoords[0] === windowCoords[0] &&
        prevCoords[1] === windowCoords[1]
      ) {
        return;
      }
      setPrevCoords(windowCoords);
      onMouseDrag({ x: windowCoords[1], y: windowCoords[0] });
    };
    canvas.style.cursor = 'crosshair';
    canvas.addEventListener('mousedown', onMouseDownHandler);
    canvas.addEventListener('mousemove', onMouseDragHandler);
    canvas.addEventListener('mouseup', onMouseUpHandler);
    return () => {
      canvas.removeEventListener('mousedown', onMouseDownHandler);
      canvas.removeEventListener('mousemove', onMouseDragHandler);
      canvas.removeEventListener('mouseup', onMouseUpHandler);
    };
  }, [
    customWidth,
    aspectRatio,
    frame,
    rows,
    columns,
    relativeBezelWidth,
    relativeGutterWidth,
    strictBoundsChecking,
    setDrag,
    drag,
    setPrevCoords,
    prevCoords,
    onMouseDown,
    onMouseUp,
    onMouseDrag,
  ]);

  return <canvas ref={canvasRef} className={className} />;
}
