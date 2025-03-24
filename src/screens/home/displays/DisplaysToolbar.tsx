import { Slider } from '@heroui/react';
import { SearchBar } from '@luna/components/SearchBar';
import { DisplaySearchContext } from '@luna/contexts/displays/DisplaySearchContext';
import { useDebounce } from '@luna/hooks/useDebounce';
import { IconArrowsDiagonal } from '@tabler/icons-react';
import { useContext, useState } from 'react';

export interface DisplaysToolbarProps {
  minZoom: number;
  maxZoom: number;
  zoom: number;
  setZoom: (zoom: number) => void;
}

export function DisplaysToolbar({
  minZoom,
  maxZoom,
  zoom,
  setZoom,
}: DisplaysToolbarProps) {
  const [shownZoom, setShownZoom] = useState(zoom);
  const setZoomDebounced = useDebounce(setZoom, 50);

  const { setQuery } = useContext(DisplaySearchContext);

  return (
    <div className="flex flex-row items-center gap-6">
      <Slider
        size="sm"
        className="w-32"
        aria-label="Zoom"
        minValue={minZoom}
        maxValue={maxZoom}
        value={shownZoom}
        startContent={<IconArrowsDiagonal color="gray" size={20} />}
        onChange={newZoom => {
          setShownZoom(newZoom as number);
          setZoomDebounced(newZoom as number);
        }}
      />
      <SearchBar
        placeholder="Search displays..."
        setQuery={setQuery}
        className="max-w-48"
      />
    </div>
  );
}
