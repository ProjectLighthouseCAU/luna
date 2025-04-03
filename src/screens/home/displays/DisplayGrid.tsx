import { Divider } from '@heroui/react';
import { DisplayCard } from '@luna/components/DisplayCard';
import { displayLayoutId } from '@luna/constants/LayoutId';
import { useFilteredDisplays } from '@luna/hooks/useFilteredDisplays';
import { DisplayPin } from '@luna/hooks/usePinnedDisplays';
import { motion } from 'framer-motion';
import { InView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';

export interface DisplayGridProps {
  searchQuery: string;
  displayWidth: number;
}

export function DisplayGrid({ searchQuery, displayWidth }: DisplayGridProps) {
  const { pinnedDisplays, filteredUsernames } = useFilteredDisplays({
    searchQuery,
  });

  // Disable animations automatically if there are too many displays for
  // performance reasons. Unfortunately we can't seem to change the layoutId
  // after the component has mounted, so even if a user filters down the view
  // the displays might not animate: https://github.com/framer/motion/issues/2075
  const animationsEnabled = filteredUsernames.length <= 360;

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
      {filteredUsernames.length > 0 ? <Divider /> : null}
      {filteredUsernames.map(username => (
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
              className="select-none"
            />
          </motion.div>
        )}
      </InView>
    </Link>
  );
}
