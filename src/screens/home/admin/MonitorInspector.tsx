import { RoomV2Metrics } from '@luna/contexts/api/model/types';
import { MonitorInspectorLampsCard } from '@luna/screens/home/admin/MonitorInspectorLampsCard';
import { MonitorInspectorRoomCard } from '@luna/screens/home/admin/MonitorInspectorRoomCard';

export interface MonitorInspectorProps {
  metrics?: RoomV2Metrics;
}

export function MonitorInspector({ metrics }: MonitorInspectorProps) {
  return (
    <div className="flex flex-col">
      <MonitorInspectorRoomCard metrics={metrics} />
      <MonitorInspectorLampsCard metrics={metrics?.lamp_metrics ?? []} />
    </div>
  );
}
