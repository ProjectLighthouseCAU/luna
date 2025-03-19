import { LocalStorageKey } from '@luna/constants/LocalStorageKey';
import { ModelContext } from '@luna/contexts/api/model/ModelContext';
import { SearchContext } from '@luna/contexts/displays/SearchContext';
import { useLocalStorage } from '@luna/hooks/useLocalStorage';
import { HomeContent } from '@luna/screens/home/HomeContent';
import { DisplayGrid } from '@luna/screens/home/displays/DisplayGrid';
import { DisplaysToolbar } from '@luna/screens/home/displays/DisplaysToolbar';
import { useContext } from 'react';

export function DisplaysView() {
  const { query } = useContext(SearchContext);
  const { users } = useContext(ModelContext);

  const minDisplayWidth = 64;
  const maxDisplayWidth = 512;
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
          users={users}
          searchQuery={query}
          displayWidth={displayWidth}
        />
      </div>
    </HomeContent>
  );
}
