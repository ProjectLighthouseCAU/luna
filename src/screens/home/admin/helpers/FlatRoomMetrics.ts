import { ControllerMetrics, RoomMetrics } from '@luna/contexts/api/model/types';
import { Bounded } from '@luna/utils/bounded';

export interface FlatRoomMetrics extends ControllerMetrics {
  api_version: 2;
  room: string;
  ip: string;
  responsive_lamps: Bounded<number>;
}

export function flattenRoomMetrics(metrics: RoomMetrics): FlatRoomMetrics {
  return {
    api_version: metrics.api_version,
    room: metrics.room,
    ip: metrics.ip,
    responsive_lamps: {
      value: metrics.lamp_metrics.filter(l => l.responding).length,
      total: metrics.lamp_metrics.length,
    },
    ...metrics.controller_metrics,
  };
}
