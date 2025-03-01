import { Bounded } from '@luna/utils/bounded';

export interface LaserMetrics {
  rooms: RoomMetrics[];
}

export interface RoomV1Metrics {
  api_version: 1;
  controller_metrics: BoardV1Metrics;
  lamp_metrics: Map<number, BoardV1Metrics>;
}

export interface BoardV1Metrics {
  id: number;
  version: number;
  uptime: number;
  temperature: number;
  init_temperature: number;
  settings: string;
  timeout: number;
  frames?: number;
  is_responding?: boolean;
}

export interface RoomV2Metrics {
  api_version: 2;
  room: number;
  controller_metrics: ControllerV2Metrics;
  lamp_metrics: LampV2Metrics[];
}

export interface ControllerV2Metrics {
  responding: boolean;
  pings_without_response: number;
  ping_latency_ms: number;
  firmware_version: number;
  uptime: number;
  frames: number;
  fps: number;
  core_temperature: number;
  board_temperature: number;
  shunt_voltage: number;
  voltage: number;
  power: number;
  current: number;
}

export interface LampV2Metrics {
  responding: boolean;
  firmware_version: number;
  uptime: number;
  timeout: number;
  temperature: number;
  fuse_tripped: boolean;
  flashing_status: string;
}

export type RoomMetrics = RoomV1Metrics | RoomV2Metrics;

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
