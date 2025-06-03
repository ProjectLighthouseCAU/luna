import { LampMetrics } from '@luna/contexts/api/model/types';
import { FlatRoomMetrics } from '@luna/screens/home/admin/helpers/FlatRoomMetrics';

export interface MonitorRoomCriterion {
  type: 'room';
  key: keyof FlatRoomMetrics;
}

export interface MonitorLampCriterion {
  type: 'lamp';
  key: keyof LampMetrics;
}

export type MonitorCriterion = MonitorRoomCriterion | MonitorLampCriterion;
