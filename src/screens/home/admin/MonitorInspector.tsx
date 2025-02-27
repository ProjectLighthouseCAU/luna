import { LampV2Metrics } from '@luna/contexts/api/model/types';
import { FlatRoomV2Metrics } from '@luna/screens/home/admin/helpers/FlatRoomV2Metrics';
import { MonitorFilter } from '@luna/screens/home/admin/helpers/MonitorFilter';
import { MonitorInspectorLampsCard } from '@luna/screens/home/admin/MonitorInspectorLampsCard';
import { MonitorInspectorRoomCard } from '@luna/screens/home/admin/MonitorInspectorRoomCard';

export interface MonitorInspectorProps {
  filter?: MonitorFilter;
  setFilter: (filter?: MonitorFilter) => void;
  flatRoomMetrics?: FlatRoomV2Metrics;
  lampMetrics?: LampV2Metrics[];
}

export function MonitorInspector({
  filter,
  setFilter,
  flatRoomMetrics,
  lampMetrics,
}: MonitorInspectorProps) {
  return (
    <div className="flex flex-col space-y-3">
      <MonitorInspectorRoomCard
        filter={filter?.type === 'room' ? filter : undefined}
        setFilter={setFilter}
        metrics={flatRoomMetrics}
      />
      <MonitorInspectorLampsCard
        filter={filter?.type === 'lamp' ? filter : undefined}
        setFilter={setFilter}
        metrics={lampMetrics ?? []}
      />
    </div>
  );
}
