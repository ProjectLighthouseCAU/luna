import { LampV2Metrics } from '@luna/contexts/api/model/types';
import { FlatRoomV2Metrics } from '@luna/screens/home/admin/helpers/FlatRoomV2Metrics';
import { MonitorInspectorLampsCard } from '@luna/screens/home/admin/MonitorInspectorLampsCard';
import { MonitorInspectorRoomCard } from '@luna/screens/home/admin/MonitorInspectorRoomCard';

export interface MonitorInspectorProps {
  flatRoomMetrics?: FlatRoomV2Metrics;
  lampMetrics?: LampV2Metrics[];
}

export function MonitorInspector({
  flatRoomMetrics,
  lampMetrics,
}: MonitorInspectorProps) {
  return (
    <div className="flex flex-col space-y-3">
      <MonitorInspectorRoomCard metrics={flatRoomMetrics} />
      <MonitorInspectorLampsCard metrics={lampMetrics ?? []} />
    </div>
  );
}
