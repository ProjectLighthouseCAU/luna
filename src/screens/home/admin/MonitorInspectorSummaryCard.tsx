import {
  Names,
  ObjectInspectorTable,
} from '@luna/components/ObjectInspectorTable';
import { ObjectInspectorValue } from '@luna/components/ObjectInspectorValue';
import { TitledCard } from '@luna/components/TitledCard';
import { LocalStorageKey } from '@luna/constants/LocalStorageKey';
import { LaserMetrics } from '@luna/contexts/api/model/types';
import { useLocalStorage } from '@luna/hooks/useLocalStorage';
import { IconReportAnalytics } from '@tabler/icons-react';
import { useCallback } from 'react';

export interface MonitorInspectorSummaryCardProps {
  metrics?: LaserMetrics;
}

interface MonitorSummary {
  laser_unlocked: boolean;
  metrics_timestamp: string;
  min_ping: number;
  mean_ping: number;
  max_ping: number;
  min_power: number;
  mean_power: number;
  max_power: number;
  total_power: number;
  min_voltage: number;
  max_voltage: number;
  min_temperature: number;
  mean_temperature: number;
  max_temperature: number;
}

const names: Names<MonitorSummary> = {
  laser_unlocked: 'LaSer unlocked',
  metrics_timestamp: 'Metrics Timestamp',
  min_ping: 'Ping (min)',
  mean_ping: 'Ping (mean)',
  max_ping: 'Ping (max)',
  min_power: 'Power (min)',
  mean_power: 'Power (mean)',
  max_power: 'Power (max)',
  total_power: 'Power (total)',
  min_voltage: 'Voltage (min)',
  max_voltage: 'Voltage (max)',
  min_temperature: 'Temperature (min)',
  mean_temperature: 'Temperature (mean)',
  max_temperature: 'Temperature (max)',
};

const units: Names<any> = {
  laser_unlocked: '',
  metrics_timestamp: '',
  min_ping: 'ms',
  mean_ping: 'ms',
  max_ping: 'ms',
  min_power: 'W',
  mean_power: 'W',
  max_power: 'W',
  total_power: 'W',
  min_voltage: 'V',
  max_voltage: 'V',
  min_temperature: '°C',
  mean_temperature: '°C',
  max_temperature: '°C',
};

export function MonitorInspectorSummaryCard({
  metrics,
}: MonitorInspectorSummaryCardProps) {
  const [isCollapsed, storeCollapsed] = useLocalStorage(
    LocalStorageKey.MonitorInspectorSummaryCollapsed,
    () => false
  );
  const calculateSummary = useCallback(() => {
    if (metrics == null) return null;
    const summary: MonitorSummary = {
      laser_unlocked: metrics.unlocked,
      metrics_timestamp: new Date(metrics.timestamp).toLocaleString(),
      min_ping: Infinity,
      mean_ping: 0,
      max_ping: -Infinity,
      min_power: Infinity,
      mean_power: 0,
      max_power: -Infinity,
      total_power: 0,
      min_voltage: Infinity,
      max_voltage: -Infinity,
      min_temperature: Infinity,
      mean_temperature: 0,
      max_temperature: -Infinity,
    };
    let count = 0;
    metrics.rooms.forEach(roomMetrics => {
      if (!roomMetrics.controller_metrics.responding) {
        return null;
      }
      count++;
      if (roomMetrics.controller_metrics.ping_latency_ms < summary.min_ping)
        summary.min_ping = roomMetrics.controller_metrics.ping_latency_ms;
      if (roomMetrics.controller_metrics.ping_latency_ms > summary.max_ping)
        summary.max_ping = roomMetrics.controller_metrics.ping_latency_ms;
      summary.mean_ping += roomMetrics.controller_metrics.ping_latency_ms;

      if (roomMetrics.controller_metrics.power < summary.min_power)
        summary.min_power = roomMetrics.controller_metrics.power;
      if (roomMetrics.controller_metrics.power > summary.max_power)
        summary.max_power = roomMetrics.controller_metrics.power;
      summary.mean_power += roomMetrics.controller_metrics.power;
      summary.total_power += roomMetrics.controller_metrics.power;

      if (roomMetrics.controller_metrics.voltage < summary.min_voltage)
        summary.min_voltage = roomMetrics.controller_metrics.voltage;
      if (roomMetrics.controller_metrics.voltage > summary.max_voltage)
        summary.max_voltage = roomMetrics.controller_metrics.voltage;

      if (
        roomMetrics.controller_metrics.board_temperature <
        summary.min_temperature
      )
        summary.min_temperature =
          roomMetrics.controller_metrics.board_temperature;
      if (
        roomMetrics.controller_metrics.board_temperature >
        summary.max_temperature
      )
        summary.max_temperature =
          roomMetrics.controller_metrics.board_temperature;
      summary.mean_temperature +=
        roomMetrics.controller_metrics.board_temperature;
    });
    summary.mean_ping /= count;
    summary.mean_power /= count;
    summary.mean_temperature /= count;
    return summary;
  }, [metrics]);

  const summary = calculateSummary();

  return (
    <TitledCard
      icon={<IconReportAnalytics />}
      title={`Summary`}
      isCollapsible
      initiallyCollapsed={isCollapsed}
      onSetCollapsed={storeCollapsed}
    >
      {summary ? (
        <ObjectInspectorTable
          objects={[summary]}
          names={names}
          render={(value, prop) => (
            <ObjectInspectorValue value={value} unit={units[prop]} />
          )}
        />
      ) : (
        <div className="opacity-50">No metrics available</div>
      )}
    </TitledCard>
  );
}
