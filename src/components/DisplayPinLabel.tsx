import { DisplayRouteLabel } from '@luna/components/DisplayRouteLabel';
import { DisplayPin } from '@luna/hooks/usePinnedDisplays';

export function DisplayPinLabel({
  isActive,
  pin,
}: {
  isActive: boolean;
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
    </div>
  );
}
