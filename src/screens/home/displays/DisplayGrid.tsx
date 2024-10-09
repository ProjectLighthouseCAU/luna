import { UserModel } from '@luna/api/model/types';
import { DisplayCard } from '@luna/components/DisplayCard';
import { InView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import { Map } from 'immutable';
import { motion } from 'framer-motion';
import { displayLayoutId } from '@luna/constants/LayoutId';
import { ModelContext, Users } from '@luna/contexts/ModelContext';
import { useCallback, useContext, useMemo, useState } from 'react';
import { useAsyncIterable } from '@luna/hooks/useAsyncIterable';
import { mapAsyncIterable, mergeAsyncIterables } from '@luna/utils/async';

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
  const model = useContext(ModelContext);
  const [userModels, setUserModels] = useState<Map<string, UserModel>>(Map());

  // Filter the models case-insensitively by the search query
  const filteredUsers = useMemo(
    () =>
      users.all
        .filter(username =>
          username.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort(([u1], [u2]) => u1.localeCompare(u2)),
    [searchQuery, users.all]
  );

  // Stream (only) the filtered users
  const streamUserModels = useCallback(
    () =>
      mergeAsyncIterables(
        filteredUsers.map(user =>
          mapAsyncIterable(model.streamModel(user), userModel => ({
            user,
            userModel,
          }))
        )
      ),
    [filteredUsers, model]
  );

  const consumeUserModel = useCallback(
    ({ user, userModel }: { user: string; userModel: UserModel }) => {
      setUserModels(userModels => userModels.set(user, userModel));
    },
    []
  );

  const handleStreamError = useCallback((error: any) => {
    console.warn(`Error while streaming from display grid: ${error}`);
  }, []);

  useAsyncIterable(streamUserModels, consumeUserModel, handleStreamError);

  // Disable animations automatically if there are too many displays for
  // performance reasons. Unfortunately we can't seem to change the layoutId
  // after the component has mounted, so even if a user filters down the view
  // the displays might not animate: https://github.com/framer/motion/issues/2075
  const animationsEnabled = filteredUsers.size <= 360;

  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {[...userModels].map(([username, userModel]) => (
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
