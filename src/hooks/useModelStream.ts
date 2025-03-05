import { ModelContext } from '@luna/contexts/api/model/ModelContext';
import { emptyUserModel, UserModel } from '@luna/contexts/api/model/types';
import { useAsyncIterable } from '@luna/hooks/useAsyncIterable';
import { useCallback, useContext, useState } from 'react';

export function useModelStream(username: string): UserModel {
  const { api } = useContext(ModelContext);
  const [userModel, setUserModel] = useState<UserModel>(() => emptyUserModel());

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

  const handleStreamError = useCallback(
    (error: any) => {
      console.warn(`Error while streaming ${username}'s model: ${error}`);
    },
    [username]
  );

  useAsyncIterable(streamUserModel, consumeUserModel, handleStreamError);

  return userModel;
}
