import {
  Names,
  ObjectInspectorTable,
} from '@luna/components/ObjectInspectorTable';
import { TitledCard } from '@luna/components/TitledCard';
import { LocalStorageKey } from '@luna/constants/LocalStorageKey';
import { LaserMetrics } from '@luna/contexts/api/model/types';
import { useLocalStorage } from '@luna/hooks/useLocalStorage';
import { IconAlertTriangle } from '@tabler/icons-react';
import { useCallback } from 'react';

export interface MonitorInspectorWarningsCardProps {
  metrics?: LaserMetrics;
}

interface Warnings {
  receiving_frames_while_locked: string[];
  high_power_while_locked: string[];
  board_temperature_too_high: string[];
  core_temperature_too_high: string[];
}

const names: Names<Warnings> = {
  receiving_frames_while_locked: 'Receiving frames while LaSer is locked',
  high_power_while_locked: 'High power consumption (>2W) while LaSer is locked',
  board_temperature_too_high: 'Board temperature too high (>40°C)',
  core_temperature_too_high: 'Core temperature too high (>50°C)',
};

export function MonitorInspectorWarningsCard({
  metrics,
}: MonitorInspectorWarningsCardProps) {
  const [isCollapsed, storeCollapsed] = useLocalStorage(
    LocalStorageKey.MonitorInspectorWarningsCollapsed,
    () => false
  );
  // Warnings / Anomalies:
  // LaSer locked & FPS > 0
  // LaSer locked & power > 2W
  // board_temperature > 40°C
  // core_temperature > 50°C
  const calulateWarnings = useCallback(() => {
    if (metrics == null) return null;
    const warnings: Warnings = {
      receiving_frames_while_locked: [],
      high_power_while_locked: [],
      board_temperature_too_high: [],
      core_temperature_too_high: [],
    };
    metrics.rooms.forEach(roomMetrics => {
      if (!metrics.unlocked && roomMetrics.controller_metrics.fps > 0)
        warnings.receiving_frames_while_locked.push(roomMetrics.room);
      if (!metrics.unlocked && roomMetrics.controller_metrics.power > 2.0)
        warnings.high_power_while_locked.push(roomMetrics.room);
      if (roomMetrics.controller_metrics.board_temperature > 40.0)
        warnings.board_temperature_too_high.push(roomMetrics.room);
      if (roomMetrics.controller_metrics.core_temperature > 50.0)
        warnings.core_temperature_too_high.push(roomMetrics.room);
    });
    return warnings;
  }, [metrics]);

  const warnings = calulateWarnings();

  return (
    <TitledCard
      icon={<IconAlertTriangle />}
      title={`Warnings`}
      isCollapsible
      initiallyCollapsed={isCollapsed}
      onSetCollapsed={storeCollapsed}
    >
      {warnings ? (
        <ObjectInspectorTable
          objects={[warnings]}
          names={names}
          render={(value, prop) => value + ' '}
        />
      ) : (
        <div className="opacity-50">No warnings available</div>
      )}
    </TitledCard>
  );
}
