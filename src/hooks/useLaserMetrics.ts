import { LaserMetrics } from '@luna/contexts/api/model/types';
import { useStream } from '@luna/hooks/useStream';

export function useLaserMetrics() {
  return useStream<LaserMetrics>(['metrics', 'laser']);
}
