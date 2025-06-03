import { LampMetrics, LaserMetrics } from '@luna/contexts/api/model/types';
import { FlatRoomMetrics } from '@luna/screens/home/admin/helpers/FlatRoomMetrics';
import { MonitorCriterion } from '@luna/screens/home/admin/helpers/MonitorCriterion';
import { MonitorInspectorLampsCard } from '@luna/screens/home/admin/MonitorInspectorLampsCard';
import { MonitorInspectorRoomCard } from '@luna/screens/home/admin/MonitorInspectorRoomCard';
import { MonitorInspectorSummaryCard } from '@luna/screens/home/admin/MonitorInspectorSummaryCard';
import { MonitorInspectorWarningsCard } from '@luna/screens/home/admin/MonitorInspectorWarningsCard';

export interface MonitorInspectorProps {
  criterion?: MonitorCriterion;
  setCriterion: (criterion?: MonitorCriterion) => void;
  allMetrics?: LaserMetrics;
  flatRoomMetrics?: FlatRoomMetrics;
  lampMetrics?: LampMetrics[];
  padLampCount: number;
}

export function MonitorInspector({
  criterion,
  setCriterion,
  allMetrics,
  flatRoomMetrics,
  lampMetrics,
  padLampCount,
}: MonitorInspectorProps) {
  return (
    <div className="flex flex-col gap-3">
      <MonitorInspectorRoomCard
        criterion={criterion?.type === 'room' ? criterion : undefined}
        setCriterion={setCriterion}
        metrics={flatRoomMetrics}
      />
      <MonitorInspectorLampsCard
        criterion={criterion?.type === 'lamp' ? criterion : undefined}
        setCriterion={setCriterion}
        metrics={lampMetrics ?? []}
        padLampCount={padLampCount}
      />
      <MonitorInspectorSummaryCard metrics={allMetrics} />
      <MonitorInspectorWarningsCard metrics={allMetrics} />
    </div>
  );
}
