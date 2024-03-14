import { LocalStorageKey } from '@luna/constants/LocalStorageKey';
import { ModelContext } from '@luna/contexts/ModelContext';
import { SearchContext } from '@luna/contexts/SearchContext';
import { useLocalStorage } from '@luna/hooks/useLocalStorage';
import { HomeContent } from '@luna/screens/home/HomeContent';
import { DisplayGrid } from '@luna/screens/home/displays/DisplayGrid';
import { DisplaysToolbar } from '@luna/screens/home/displays/DisplaysToolbar';
import { useContext } from 'react';

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
      <div className="flex flex-col items-center">
        <DisplayGrid
          userModels={userModels}
          searchQuery={query}
          displayWidth={displayWidth}
        />
      </div>
    </HomeContent>
  );
}
