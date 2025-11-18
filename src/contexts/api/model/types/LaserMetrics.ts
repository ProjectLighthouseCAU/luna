import { Bounded } from '@luna/utils/bounded';

export interface LaserMetrics {
  timestamp: string;
  unlocked: boolean;
  rooms: RoomMetrics[];
}

export interface RoomMetrics {
  api_version: 2;
  room: string;
  ip: string;
  controller_metrics: ControllerMetrics;
  lamp_metrics: LampMetrics[];
}

export interface ControllerMetrics {
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

export interface LampMetrics {
  responding: boolean;
  firmware_version: number;
  uptime: number;
  timeout: number;
  temperature: number;
  fuse_tripped: boolean;
  flashing_status: string;
}

export interface FlatRoomMetrics extends ControllerMetrics {
  api_version: 2;
  room: string;
  responsive_lamps: Bounded<number>;
}

export function flattenRoomMetrics(metrics: RoomMetrics): FlatRoomMetrics {
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
