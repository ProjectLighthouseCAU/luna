import { DisplayCard } from '@luna/components/DisplayCard';
import { LocalStorageKey } from '@luna/constants/LocalStorageKey';
import { ModelContext } from '@luna/contexts/ModelContext';
import { SearchContext } from '@luna/contexts/SearchContext';
import { useLocalStorage } from '@luna/hooks/useLocalStorage';
import { HomeContent } from '@luna/screens/home/HomeContent';
import { DisplaysToolbar } from '@luna/screens/home/displays/DisplaysToolbar';
import { useContext } from 'react';
import { InView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';

export function DisplaysView() {
  const { query } = useContext(SearchContext);
  const { userModels } = useContext(ModelContext);

  const minDisplayWidth = 10;
  const maxDisplayWidth = 800;
  const [displayWidth, setDisplayWidth] = useLocalStorage(
    LocalStorageKey.DisplaysZoom,
    () => 300
  );

  return (
    <HomeContent
      title="Displays"
      toolbar={
        <DisplaysToolbar
          minZoom={minDisplayWidth}
          maxZoom={maxDisplayWidth}
          zoom={displayWidth}
          setZoom={setDisplayWidth}
        />
      }
    >
      <div className="flex flex-col space-y-4">
        <div className="flex flex-wrap gap-4 justify-center">
          {[...userModels.entries()]
            .filter(([username]) =>
              username.toLowerCase().includes(query.toLowerCase())
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
      </div>
    </HomeContent>
  );
}
