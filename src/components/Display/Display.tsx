import React, { useEffect, useRef } from 'react';

export function Display() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
  }, []);

  return <canvas ref={canvasRef} />;
}
