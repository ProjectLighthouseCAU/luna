import { DisplayCard } from '@luna/components/DisplayCard';
import { ModelContext } from '@luna/contexts/ModelContext';
import { HomeContent } from '@luna/screens/home/HomeContent';
import { useContext } from 'react';
import { InView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';

export function DisplaysView() {
  const { userModels } = useContext(ModelContext);

  return (
    <HomeContent title="Displays">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-wrap">
          {[...userModels.entries()]
            .sort(([u1], [u2]) => u1.localeCompare(u2))
            .map(([username, userModel]) => (
              <Link to={username} key={username}>
                <InView>
                  {({ inView, ref }) => (
                    <div ref={ref}>
                      <DisplayCard
                        username={username}
                        frame={userModel.frame}
                        isSkeleton={!inView}
                      />
                    </div>
                  )}
                </InView>
              </Link>
            ))}
        </div>
      </div>
    </HomeContent>
  );
}
