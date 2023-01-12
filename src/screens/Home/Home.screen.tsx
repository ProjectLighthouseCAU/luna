import { Display } from '@luna/components/Display';
import { WindowDimensionsContext } from '@luna/contexts/WindowDimensions';
import { LIGHTHOUSE_FRAME_BYTES } from 'nighthouse/browser';
import { useContext } from 'react';

export function HomeScreen() {
  const dimensions = useContext(WindowDimensionsContext);

  // TODO
  return (
    <Display
      maxWidth={dimensions.width}
      maxHeight={dimensions.height}
      frame={new Uint8Array(LIGHTHOUSE_FRAME_BYTES)}
    />
  );
}
