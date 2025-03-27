import { LocalStorageKey } from '@luna/constants/LocalStorageKey';
import { DisplaySearchContext } from '@luna/contexts/displays/DisplaySearchContext';
import { useLocalStorage } from '@luna/hooks/useLocalStorage';
import { HomeContent } from '@luna/screens/home/HomeContent';
import { DisplayGrid } from '@luna/screens/home/displays/DisplayGrid';
import { DisplaysToolbar } from '@luna/screens/home/displays/DisplaysToolbar';
import { useContext } from 'react';

export function DisplaysView() {
  const { query } = useContext(DisplaySearchContext);

  const minDisplayWidth = 64;
  const maxDisplayWidth = 512;
  const [displayWidth, setDisplayWidth] = useLocalStorage(
    LocalStorageKey.DisplaysZoom,
    () => 146 // Not using a "round" number here, because this seems to produce better antialiasing...
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
        <DisplayGrid searchQuery={query} displayWidth={displayWidth} />
      </div>
    </HomeContent>
  );
}
