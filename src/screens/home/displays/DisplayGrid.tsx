import { Divider } from '@heroui/react';
import { DisplayCard } from '@luna/components/DisplayCard';
import { displayLayoutId } from '@luna/constants/LayoutId';
import { Users } from '@luna/contexts/api/model/ModelContext';
import { DisplayPin, usePinnedDisplays } from '@luna/hooks/usePinnedDisplays';
import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { InView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';

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
  const pinnedDisplays = usePinnedDisplays();

  // Filter the models case-insensitively by the search query
  const filteredUsers = useMemo(
    () =>
      users.all.filter(
        username =>
          !pinnedDisplays.has(username) &&
          username.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [pinnedDisplays, searchQuery, users.all]
  );

  // Disable animations automatically if there are too many displays for
  // performance reasons. Unfortunately we can't seem to change the layoutId
  // after the component has mounted, so even if a user filters down the view
  // the displays might not animate: https://github.com/framer/motion/issues/2075
  const animationsEnabled = filteredUsers.size <= 360;

  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {[...pinnedDisplays.entries()].map(([username, pin]) => (
        <DisplayLink
          key={username}
          username={username}
          animationsEnabled={animationsEnabled}
          displayWidth={displayWidth}
          pin={pin}
        />
      ))}
      <Divider />
      {[...filteredUsers]
        .sort((u1, u2) => u1.localeCompare(u2))
        .map(username => (
          <DisplayLink
            key={username}
            username={username}
            animationsEnabled={animationsEnabled}
            displayWidth={displayWidth}
          />
        ))}
    </div>
  );
}

function DisplayLink({
  username,
  animationsEnabled,
  displayWidth,
  pin,
}: {
  username: string;
  animationsEnabled: boolean;
  displayWidth: number;
  pin?: DisplayPin;
}) {
  return (
    <Link to={username}>
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
              pin={pin}
              isSkeleton={!inView}
            />
          </motion.div>
        )}
      </InView>
    </Link>
  );
}
