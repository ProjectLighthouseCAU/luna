import { LampV2Metrics } from '@luna/contexts/api/model/types';
import { FlatRoomV2Metrics } from '@luna/screens/home/admin/helpers/FlatRoomV2Metrics';

export interface MonitorRoomCriterion {
  type: 'room';
  key: keyof FlatRoomV2Metrics;
}

export interface MonitorLampCriterion {
  type: 'lamp';
  key: keyof LampV2Metrics;
}

export type MonitorCriterion = MonitorRoomCriterion | MonitorLampCriterion;
