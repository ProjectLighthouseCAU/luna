import { emptyUserModel, UserModel } from '@luna/contexts/api/model/types';
import { DisplayCard } from '@luna/components/DisplayCard';
import { InView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import { Map } from 'immutable';
import { motion } from 'framer-motion';
import { displayLayoutId } from '@luna/constants/LayoutId';
import { ModelContext, Users } from '@luna/contexts/api/model/ModelContext';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAsyncIterable } from '@luna/hooks/useAsyncIterable';
import {
  catchAsyncIterable,
  mapAsyncIterable,
  mergeAsyncIterables,
} from '@luna/utils/async';

export interface DisplayGridProps {
  users: Users;
  searchQuery: string;
  displayWidth: number;
}

export function DisplayGrid({
  users,
  searchQuery,
  displayWidth,
}: DisplayGridProps) {
  const { api } = useContext(ModelContext);

  // Filter the models case-insensitively by the search query
  const filteredUsers = useMemo(
    () =>
      users.all.filter(username =>
        username.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [searchQuery, users.all]
  );

  const [userModels, setUserModels] = useState<Map<string, UserModel>>(() =>
    Map(filteredUsers.map(user => [user, emptyUserModel()]))
  );

  // Stream (only) the filtered users
  const streamUserModels = useCallback(() => {
    console.log('Streaming user models');
    return mergeAsyncIterables(
      filteredUsers.map(user =>
        catchAsyncIterable(
          mapAsyncIterable(api.streamModel(user), userModel => ({
            user,
            userModel,
          })),
          error => {
            console.warn(
              `Error while streaming ${user} from display grid: ${error}`
            );
          }
        )
      )
    );
  }, [api, filteredUsers]);

  const consumeUserModel = useCallback(
    ({ user, userModel }: { user: string; userModel: UserModel }) => {
      setUserModels(userModels => userModels.set(user, userModel));
    },
    []
  );

  useAsyncIterable(streamUserModels, consumeUserModel);

  useEffect(() => {
    const missingUsers = filteredUsers.filter(user => !userModels.has(user));
    setUserModels(userModels =>
      userModels.merge(missingUsers.map(user => [user, emptyUserModel()]))
    );
  }, [filteredUsers, userModels]);

  // Disable animations automatically if there are too many displays for
  // performance reasons. Unfortunately we can't seem to change the layoutId
  // after the component has mounted, so even if a user filters down the view
  // the displays might not animate: https://github.com/framer/motion/issues/2075
  const animationsEnabled = filteredUsers.size <= 360;

  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {[...userModels]
        .sort(([u1], [u2]) => u1.localeCompare(u2))
        .map(([username, userModel]) => (
          <Link to={username} key={username}>
            <InView>
              {({ inView, ref }) => (
                <motion.div
                  ref={ref}
                  {...(animationsEnabled
                    ? { layoutId: displayLayoutId(username) }
                    : {})}
                >
                  <DisplayCard
                    username={username}
                    frame={userModel.frame}
                    displayWidth={displayWidth}
                    isSkeleton={!inView}
                  />
                </motion.div>
              )}
            </InView>
          </Link>
        ))}
    </div>
  );
}
