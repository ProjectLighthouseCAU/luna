import { UserModel } from '@luna/client/model/UserModel';
import { DisplayCard } from '@luna/components/DisplayCard';
import { InView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import { Map } from 'immutable';

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
  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {[...userModels.entries()]
        .filter(([username]) =>
          username.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort(([u1], [u2]) => u1.localeCompare(u2))
        .map(([username, userModel]) => (
          <Link to={username} key={username}>
            <InView>
              {({ inView, ref }) => (
                <div ref={ref}>
                  <DisplayCard
                    username={username}
                    frame={userModel.frame}
                    displayWidth={displayWidth}
                    isSkeleton={!inView}
                  />
                </div>
              )}
            </InView>
          </Link>
        ))}
    </div>
  );
}
