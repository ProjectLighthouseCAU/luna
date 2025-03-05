import { LIGHTHOUSE_FRAME_BYTES } from 'nighthouse/browser';

export interface UserModel {
  readonly frame: Uint8Array;
}

export function emptyUserModel(): UserModel {
  return {
    frame: new Uint8Array(LIGHTHOUSE_FRAME_BYTES),
  };
}
