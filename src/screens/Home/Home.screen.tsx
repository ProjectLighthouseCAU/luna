import { LIGHTHOUSE_FRAME_BYTES } from 'nighthouse/browser';
import { useContext } from 'react';
import { Display } from '../../components/Display';
import { WindowDimensionsContext } from '../../contexts/WindowDimensions';

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
