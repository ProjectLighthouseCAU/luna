import { Display } from '@luna/components/Display';
import { LIGHTHOUSE_FRAME_BYTES } from 'nighthouse/browser';

export function HomeScreen() {
  // TODO
  return <Display frame={new Uint8Array(LIGHTHOUSE_FRAME_BYTES)} />;
}
