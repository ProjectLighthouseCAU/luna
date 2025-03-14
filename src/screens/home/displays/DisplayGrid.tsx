import { DisplayCard } from '@luna/components/DisplayCard';
import { InView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { displayLayoutId } from '@luna/constants/LayoutId';
import { Users } from '@luna/contexts/api/model/ModelContext';
import { useMemo } from 'react';

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
  // Filter the models case-insensitively by the search query
  const filteredUsers = useMemo(
    () =>
      users.all.filter(username =>
        username.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [searchQuery, users.all]
  );

  // Disable animations automatically if there are too many displays for
  // performance reasons. Unfortunately we can't seem to change the layoutId
  // after the component has mounted, so even if a user filters down the view
  // the displays might not animate: https://github.com/framer/motion/issues/2075
  const animationsEnabled = filteredUsers.size <= 360;

  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {[...filteredUsers]
        .sort((u1, u2) => u1.localeCompare(u2))
        .map(username => (
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
