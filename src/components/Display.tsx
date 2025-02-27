import React, { useLayoutEffect, useRef, useState } from 'react';
import { Set } from 'immutable';
import {
  LIGHTHOUSE_COLOR_CHANNELS,
  LIGHTHOUSE_COLS,
  LIGHTHOUSE_ROWS,
} from 'nighthouse/browser';
import { Vec2 } from '@luna/utils/vec2';
import * as vec2 from '@luna/utils/vec2';

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
  highlightedWindows?: Set<number>;
  focusedWindows?: Set<number>;
  onMouseDown?: (p: Vec2<number>) => void;
  onMouseUp?: (p: Vec2<number>) => void;
  onMouseDrag?: (p: Vec2<number>) => void;
  onMouseMove?: (p?: Vec2<number>) => void;
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
  highlightedWindows = Set(),
  focusedWindows = Set(),
  onMouseDown = () => {},
  onMouseUp = () => {},
  onMouseDrag = () => {},
  onMouseMove = () => {},
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
    ctx.fillStyle = 'rgb(50, 50, 50)';
    ctx.fillRect(0, 0, width, height);

    // Draw bezels
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, bezelWidth, height);
    ctx.fillRect(width - bezelWidth, 0, bezelWidth, height);

    // Draw gutters
    ctx.fillStyle = 'rgb(128, 128, 128)';
    for (let j = 0; j < gutterCount; j++) {
      const x = bezelWidth + j * (windowWidth + gutterWidth);
      ctx.fillRect(x, 0, gutterWidth, height);
    }

    // Draw highlights
    const highlightPadding = gutterWidth;
    const drawHighlights = (windows: Set<number>) => {
      for (const w of windows) {
        const i = Math.floor(w / LIGHTHOUSE_COLS);
        const j = w % LIGHTHOUSE_COLS;
        const x = bezelWidth + j * windowWidth + (j + 1) * gutterWidth;
        const y = i * (1 + spacersPerRow) * windowHeight;
        ctx.fillRect(
          x - highlightPadding,
          y - highlightPadding,
          windowWidth + 2 * highlightPadding,
          windowHeight + 2 * highlightPadding
        );
      }
    };
    ctx.fillStyle = 'rgb(180, 180, 180)';
    drawHighlights(highlightedWindows);
    ctx.fillStyle = 'white';
    drawHighlights(focusedWindows);

    // Draw windows
    for (let j = 0; j < columns; j++) {
      const x = bezelWidth + j * windowWidth + (j + 1) * gutterWidth;

      for (let i = 0; i < rows; i++) {
        const y = i * (1 + spacersPerRow) * windowHeight;
        const w = i * LIGHTHOUSE_COLS + j;
        const k = w * LIGHTHOUSE_COLOR_CHANNELS;
        const rgb = frame.slice(k, k + LIGHTHOUSE_COLOR_CHANNELS);
        ctx.fillStyle = `rgb(${rgb.join(',')})`;
        ctx.fillRect(x, y, windowWidth, windowHeight);
      }
    }

    const eventToMouseCoords = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x:
          ((event.clientX - rect.left) / (rect.right - rect.left)) *
          canvas.width,
        y:
          ((event.clientY - rect.top) / (rect.bottom - rect.top)) *
          canvas.height,
      };
    };

    const clampToNormalizedRange = (x: number) =>
      Math.min(0.99999, Math.max(0, x));

    const mouseToWindowCoords = (mouseCoords: Vec2<number>) => {
      return {
        x:
          clampToNormalizedRange(
            (mouseCoords.x - bezelWidth - gutterWidth) /
              (width - 2 * bezelWidth - gutterWidth)
          ) * LIGHTHOUSE_COLS,
        y:
          clampToNormalizedRange((mouseCoords.y + windowHeight / 2) / height) *
          LIGHTHOUSE_ROWS,
      };
    };

    const onMouseDownHandler = (event: MouseEvent) => {
      setDrag(true);

      const mouseCoords = eventToMouseCoords(event);
      const windowCoords = mouseToWindowCoords(mouseCoords);

      setPrevCoords(windowCoords); // for consecutive drag
      onMouseDown(windowCoords);
    };

    const onMouseUpHandler = (event: MouseEvent) => {
      setDrag(false);

      const mouseCoords = eventToMouseCoords(event);
      const windowCoords = mouseToWindowCoords(mouseCoords);

      setPrevCoords(windowCoords); // for consecutive drag
      onMouseUp(windowCoords);
    };

    const onMouseMoveHandler = (event: MouseEvent) => {
      const mouseCoords = eventToMouseCoords(event);
      const windowCoords = mouseToWindowCoords(mouseCoords);
      // don't emit drag events if coords haven't changed
      if (prevCoords && vec2.areEqual(prevCoords, windowCoords)) {
        return;
      }

      setPrevCoords(windowCoords);
      if (drag) {
        onMouseDrag(windowCoords);
      } else {
        onMouseMove(windowCoords);
      }
    };

    const onMouseOutHandler = (event: MouseEvent) => {
      onMouseMove(undefined);
    };

    canvas.style.cursor = 'crosshair';
    canvas.addEventListener('mousedown', onMouseDownHandler);
    canvas.addEventListener('mousemove', onMouseMoveHandler);
    canvas.addEventListener('mouseup', onMouseUpHandler);
    canvas.addEventListener('mouseout', onMouseOutHandler);
    return () => {
      canvas.removeEventListener('mousedown', onMouseDownHandler);
      canvas.removeEventListener('mousemove', onMouseMoveHandler);
      canvas.removeEventListener('mouseup', onMouseUpHandler);
      canvas.removeEventListener('mouseout', onMouseOutHandler);
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
    onMouseMove,
    highlightedWindows,
    focusedWindows,
  ]);

  return <canvas ref={canvasRef} className={className} />;
}
