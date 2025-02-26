import {
  ControllerV2Metrics,
  RoomV2Metrics,
} from '@luna/contexts/api/model/types';
import { Bounded } from '@luna/utils/bounded';

export interface FlatRoomV2Metrics extends ControllerV2Metrics {
  api_version: 2;
  room: number;
  responsive_lamps: Bounded<number>;
}

export function flattenRoomV2Metrics(
  metrics: RoomV2Metrics
): FlatRoomV2Metrics {
  return {
    api_version: metrics.api_version,
    room: metrics.room,
    responsive_lamps: {
      value: metrics.lamp_metrics.filter(l => l.responding).length,
      total: metrics.lamp_metrics.length,
    },
    ...metrics.controller_metrics,
  };
}
