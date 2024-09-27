import { UserModel } from '@luna/api/model/types';
import { DisplayCard } from '@luna/components/DisplayCard';
import { InView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import { Map } from 'immutable';
import { motion } from 'framer-motion';
import { displayLayoutId } from '@luna/constants/LayoutId';

export interface DisplayGridProps {
  userModels: Map<string, UserModel>;
  searchQuery: string;
  displayWidth: number;
}

export function DisplayGrid({
  userModels,
  searchQuery,
  displayWidth,
}: DisplayGridProps) {
  // Filter the models case-insensitively by the search query
  const filteredModels = [...userModels.entries()]
    .filter(([username]) =>
      username.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort(([u1], [u2]) => u1.localeCompare(u2));

  // Disable animations automatically if there are too many displays for
  // performance reasons. Unfortunately we can't seem to change the layoutId
  // after the component has mounted, so even if a user filters down the view
  // the displays might not animate: https://github.com/framer/motion/issues/2075
  const animationsEnabled = filteredModels.length <= 360;

  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {filteredModels.map(([username, userModel]) => (
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
