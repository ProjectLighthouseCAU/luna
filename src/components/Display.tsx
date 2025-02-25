import React, { useLayoutEffect, useRef, useState } from 'react';
import {
  LIGHTHOUSE_COLOR_CHANNELS,
  LIGHTHOUSE_COLS,
  LIGHTHOUSE_ROWS,
} from 'nighthouse/browser';
import { Vec2, vec2Equal as vec2AreEqual } from '@luna/utils/vec2';

export const DISPLAY_ASPECT_RATIO = 0.8634;

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
  onMouseDown?: (p: Vec2<number>) => void;
  onMouseUp?: (p: Vec2<number>) => void;
  onMouseDrag?: (p: Vec2<number>) => void;
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
  onMouseDown = (p: Vec2<number>) => {},
  onMouseUp = (p: Vec2<number>) => {},
  onMouseDrag = (p: Vec2<number>) => {},
}: DisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [drag, setDrag] = useState(false);
  const [prevCoords, setPrevCoords] = useState<Vec2<number>>();
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

    // Draw windows
    for (let j = 0; j < columns; j++) {
      const x = bezelWidth + j * windowWidth + (j + 1) * gutterWidth;

      for (let i = 0; i < rows; i++) {
        const y = i * (1 + spacersPerRow) * windowHeight;
        const k = (i * LIGHTHOUSE_COLS + j) * LIGHTHOUSE_COLOR_CHANNELS;
        const rgb = frame.slice(k, k + LIGHTHOUSE_COLOR_CHANNELS);
        ctx.fillStyle = `rgb(${rgb.join(',')})`;
        ctx.fillRect(x, y, windowWidth, windowHeight);
      }
    }

    const eventToMouseCoords = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    };

    const mouseToWindowCoords = (mouseCoords: Vec2<number>) => {
      return {
        x: (mouseCoords.x / width) * LIGHTHOUSE_COLS,
        y: (mouseCoords.y / height) * LIGHTHOUSE_ROWS,
      };
    };

    const onMouseDownHandler = (event: MouseEvent) => {
      setDrag(true);

      const mouseCoords = eventToMouseCoords(event);
      const windowCoords = mouseToWindowCoords(mouseCoords);
      if (!windowCoords) return; // in case of strict bounds checking

      setPrevCoords(windowCoords); // for consecutive drag
      onMouseDown(windowCoords);
    };
    const onMouseUpHandler = (event: MouseEvent) => {
      setDrag(false);

      const mouseCoords = eventToMouseCoords(event);
      const windowCoords = mouseToWindowCoords(mouseCoords);
      if (!windowCoords) return; // in case of strict bounds checking

      setPrevCoords(windowCoords); // for consecutive drag
      onMouseUp(windowCoords);
    };

    const onMouseDragHandler = (event: MouseEvent) => {
      if (!drag) return;

      const mouseCoords = eventToMouseCoords(event);
      const windowCoords = mouseToWindowCoords(mouseCoords);
      if (!windowCoords) return; // in case of strict bounds checking
      // don't emit drag events if coords haven't changed
      if (prevCoords && vec2AreEqual(prevCoords, windowCoords)) {
        return;
      }

      setPrevCoords(windowCoords);
      onMouseDrag(windowCoords);
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
