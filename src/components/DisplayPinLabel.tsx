import { DisplayRouteLabel } from '@luna/components/DisplayRouteLabel';
import { DisplayPin } from '@luna/hooks/usePinnedDisplays';
import { IconPin } from '@tabler/icons-react';

export function DisplayPinLabel({
  isActive = false,
  pin,
}: {
  isActive?: boolean;
  pin: DisplayPin;
}) {
  return (
    <div className="flex flex-row gap-2">
      {pin.me ? (
        <DisplayRouteLabel isActive={isActive} color="secondary">
          me
        </DisplayRouteLabel>
      ) : undefined}
      {pin.live ? (
        <DisplayRouteLabel isActive={isActive} color="danger">
          live
        </DisplayRouteLabel>
      ) : undefined}
      {pin.userPinned ? <IconPin /> : undefined}
    </div>
  );
}
