import { useAsyncIterable } from '@luna/hooks/useAsyncIterable';
import { UserModel } from '@luna/api/model/types';
import { LIGHTHOUSE_FRAME_BYTES } from 'nighthouse/browser';
import { mapAsyncIterable } from '@luna/utils/async';
import { useCallback, useContext, useLayoutEffect, useState } from 'react';
import { ModelContext } from '@luna/contexts/ModelContext';
import { Display, DisplayProps } from '@luna/components/Display';

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
  const model = useContext(ModelContext);

  const [userModel, setUserModel] = useState<UserModel>({
    frame: new Uint8Array(LIGHTHOUSE_FRAME_BYTES),
  });

  const streamUserModel = useCallback(() => {
    console.log(`Streaming ${username}`);

    // We have to clear the frame since React will persist the userModel state
    // even as the route changes if the `<DisplayView />` stays where it is in the
    // DOM (e.g. when switching displays in the sidebar).
    setUserModel({ frame: new Uint8Array(LIGHTHOUSE_FRAME_BYTES) });

    return mapAsyncIterable(model.streamModel(username), userModel => ({
      streamedUser: username,
      userModel,
    }));
  }, [model, username]);

  // TODO: Maybe we should factor out all of this streaming logic and share it
  // with DisplayGrid's displays.  That would likely simplify it a lot since we
  // could just pass the username as a prop and wouldn't have to deal with this
  // out-of-order stuff.

  const consumeUserModel = useCallback(
    ({
      streamedUser,
      userModel,
    }: {
      streamedUser: string;
      userModel: UserModel;
    }) => {
      if (streamedUser !== username) {
        console.warn(
          `Got out-of-order model for ${streamedUser}, even though we should be receiving ${userModel}`
        );
        return;
      }
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
