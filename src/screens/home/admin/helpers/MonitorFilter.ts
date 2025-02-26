import { LampV2Metrics } from '@luna/contexts/api/model/types';
import { FlatRoomV2Metrics } from '@luna/screens/home/admin/helpers/FlatRoomV2Metrics';

export interface MonitorRoomFilter {
  type: 'room';
  key: keyof FlatRoomV2Metrics;
}

export interface MonitorLampFilter {
  type: 'lamp';
  key: keyof LampV2Metrics;
}

export type MonitorFilter = MonitorRoomFilter | MonitorLampFilter;
