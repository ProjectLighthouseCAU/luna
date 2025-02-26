import { useDebounce } from '@luna/hooks/useDebounce';
import { Slider } from '@heroui/react';
import { IconArrowsDiagonal } from '@tabler/icons-react';
import { useState } from 'react';

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

  return (
    <div className="flex flex-row items-center gap-2">
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
    </div>
  );
}
