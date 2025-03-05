import { LampV2Metrics } from '@luna/contexts/api/model/types';
import { FlatRoomV2Metrics } from '@luna/screens/home/admin/helpers/FlatRoomV2Metrics';
import { MonitorCriterion } from '@luna/screens/home/admin/helpers/MonitorCriterion';
import { MonitorInspectorLampsCard } from '@luna/screens/home/admin/MonitorInspectorLampsCard';
import { MonitorInspectorRoomCard } from '@luna/screens/home/admin/MonitorInspectorRoomCard';

export interface MonitorInspectorProps {
  criterion?: MonitorCriterion;
  setCriterion: (criterion?: MonitorCriterion) => void;
  flatRoomMetrics?: FlatRoomV2Metrics;
  lampMetrics?: LampV2Metrics[];
}

export function MonitorInspector({
  criterion,
  setCriterion,
  flatRoomMetrics,
  lampMetrics,
}: MonitorInspectorProps) {
  return (
    <div className="flex flex-col space-y-3 2xl:w-[600px]">
      <MonitorInspectorRoomCard
        criterion={criterion?.type === 'room' ? criterion : undefined}
        setCriterion={setCriterion}
        metrics={flatRoomMetrics}
      />
      <MonitorInspectorLampsCard
        criterion={criterion?.type === 'lamp' ? criterion : undefined}
        setCriterion={setCriterion}
        metrics={lampMetrics ?? []}
      />
    </div>
  );
}
