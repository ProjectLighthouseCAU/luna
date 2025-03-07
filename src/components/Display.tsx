import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Set } from 'immutable';
import {
  LIGHTHOUSE_COLOR_CHANNELS,
  LIGHTHOUSE_COLS,
  LIGHTHOUSE_ROWS,
} from 'nighthouse/browser';
import { Vec2 } from '@luna/utils/vec2';
import * as vec2 from '@luna/utils/vec2';

export const DISPLAY_ASPECT_RATIO = 0.8634;

/** A mouse state (position/movement) in lighthouse window coordinates. */
export interface DisplayMouse {
  pos: Vec2<number>;
  movement: Vec2<number>;
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
  highlightedWindows?: Set<number>;
  focusedWindows?: Set<number>;
  cursor?: string;
  isPointerLockable?: boolean;
  onMouseDown?: (m: DisplayMouse) => void;
  onMouseUp?: (m: DisplayMouse) => void;
  onMouseDrag?: (m: DisplayMouse) => void;
  onMouseMove?: (m?: DisplayMouse) => void;
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
  cursor,
  isPointerLockable,
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

    const relativePixelPosToMouseVec = (eventVec: Vec2<number>) => {
      // Note that we need to normalize/rescale here to obtain logical
      // coordinates on high-DPI displays. See https://stackoverflow.com/a/33063222
      const rect = canvas.getBoundingClientRect();
      return {
        x: (eventVec.x / (rect.right - rect.left)) * canvas.width,
        y: (eventVec.y / (rect.bottom - rect.top)) * canvas.height,
      };
    };

    const eventToMouseCoords = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      return relativePixelPosToMouseVec({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      });
    };

    const eventToMouseVec = (event: MouseEvent) => {
      return relativePixelPosToMouseVec({
        x: event.movementX,
        y: event.movementY,
      });
    };

    const eventToWindowMouse = (event: MouseEvent) => {
      const mouseCoords = eventToMouseCoords(event);
      const mouseVec = eventToMouseVec(event);
      const windowCoords = mouseToWindowCoords(mouseCoords);
      const windowVec = relativeMouseToWindowVec(mouseVec);
      return { pos: windowCoords, movement: windowVec };
    };

    const clampToNormalizedRange = (x: number) =>
      Math.min(0.99999, Math.max(0, x));

    const relativeMouseToWindowVec = (mouseVec: Vec2<number>) => {
      return {
        x:
          clampToNormalizedRange(
            mouseVec.x / (width - 2 * bezelWidth - gutterWidth)
          ) * LIGHTHOUSE_COLS,
        y: clampToNormalizedRange(mouseVec.y / height) * LIGHTHOUSE_ROWS,
      };
    };

    const mouseToWindowCoords = (mouseCoords: Vec2<number>) => {
      return relativeMouseToWindowVec({
        x: mouseCoords.x - bezelWidth - gutterWidth,
        y: mouseCoords.y + windowHeight / 2,
      });
    };

    const onMouseDownHandler = (event: MouseEvent) => {
      setDrag(true);

      const mouse = eventToWindowMouse(event);

      setPrevCoords(mouse.pos); // for consecutive drag
      onMouseDown(mouse);
    };

    const onMouseUpHandler = (event: MouseEvent) => {
      setDrag(false);

      const mouse = eventToWindowMouse(event);

      setPrevCoords(mouse.pos); // for consecutive drag
      onMouseUp(mouse);
    };

    const onMouseMoveHandler = (event: MouseEvent) => {
      const mouse = eventToWindowMouse(event);

      // don't emit drag events if coords haven't changed (unless the pointer is locked)
      if (
        document.pointerLockElement === null &&
        prevCoords &&
        vec2.areEqual(prevCoords, mouse.pos)
      ) {
        return;
      }

      setPrevCoords(mouse.pos);
      if (drag) {
        onMouseDrag(mouse);
      } else {
        onMouseMove(mouse);
      }
    };

    const onMouseOutHandler = (event: MouseEvent) => {
      onMouseMove(undefined);
    };

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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    if (cursor !== undefined) {
      canvas.style.cursor = cursor;
    } else {
      canvas.style.removeProperty('cursor');
    }
  }, [cursor]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const listener = async () => {
      if (isPointerLockable) {
        await canvas.requestPointerLock();
      }
    };
    canvas.addEventListener('click', listener);
    return () => {
      canvas.removeEventListener('click', listener);
    };
  }, [isPointerLockable]);

  return <canvas ref={canvasRef} className={className} />;
}
