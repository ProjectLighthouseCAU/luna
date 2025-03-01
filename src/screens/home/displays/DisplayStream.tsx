import { Display, DisplayProps } from '@luna/components/Display';
import { ModelContext } from '@luna/contexts/api/model/ModelContext';
import { UserModel } from '@luna/contexts/api/model/types';
import { useAsyncIterable } from '@luna/hooks/useAsyncIterable';
import { LIGHTHOUSE_FRAME_BYTES } from 'nighthouse/browser';
import { useCallback, useContext, useLayoutEffect, useState } from 'react';

export interface DisplayStreamProps extends Omit<DisplayProps, 'frame'> {
  username: string;
  layoutOnModelUpdate?: () => void;
}

// TODO: Use this in DisplayGrid too

export function DisplayStream({
  username,
  layoutOnModelUpdate,
  ...displayProps
}: DisplayStreamProps) {
  const { api } = useContext(ModelContext);

  const [userModel, setUserModel] = useState<UserModel>({
    frame: new Uint8Array(LIGHTHOUSE_FRAME_BYTES),
  });

  const streamUserModel = useCallback(() => {
    console.log(`Streaming ${username}`);
    return api.streamModel(username);
  }, [api, username]);

  const consumeUserModel = useCallback(
    (userModel: UserModel) => {
      console.log(`Got model from ${username}`);
      setUserModel(userModel);
    },
    [username]
  );

  const handleStreamError = useCallback((error: any) => {
    console.warn(`Error while streaming from display view: ${error}`);
  }, []);

  useAsyncIterable(streamUserModel, consumeUserModel, handleStreamError);

  // Perform layout updates (e.g. resizing the canvas) after the model has been added
  useLayoutEffect(() => {
    if (userModel) {
      layoutOnModelUpdate?.();
    }
  }, [layoutOnModelUpdate, userModel]);

  return <Display frame={userModel.frame} {...displayProps} />;
}
