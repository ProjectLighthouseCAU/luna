import { LampV2Metrics } from '@luna/contexts/api/model/types';
import { Card, CardBody, CardHeader, Chip } from '@nextui-org/react';

export interface MonitorInspectorLampsCardProps {
  metrics: LampV2Metrics[];
}

export function MonitorInspectorLampsCard({
  metrics,
}: MonitorInspectorLampsCardProps) {
  return (
    <Card className="p-2 m-2 min-w-[320px] h-fit">
      {metrics ? (
        <>
          <CardHeader>
            <b>Lamps:</b>
          </CardHeader>
          <CardBody>
            {metrics.map((lamp: any, idx: number) => (
              <div key={idx}>
                <br />
                <b>Lamp {idx + 1}:</b>
                <div>
                  Responding:{' '}
                  {lamp.responding ? (
                    <Chip color="success" variant="flat">
                      true
                    </Chip>
                  ) : (
                    <Chip color="danger" variant="flat">
                      false
                    </Chip>
                  )}
                </div>
                <div>Firmware-Version: {lamp.firmware_version}</div>
                <div>Uptime (not very accurate): {lamp.uptime}s</div>
                <div>Timeout: {lamp.timeout}s</div>
                <div>
                  Temperature (not very accurate): {lamp.temperature}
                  °C
                </div>
                <div>
                  Fuse tripped?{' '}
                  {lamp.fuse_tripped ? (
                    <Chip color="danger" variant="flat">
                      Yes
                    </Chip>
                  ) : (
                    <Chip color="success" variant="flat">
                      No
                    </Chip>
                  )}
                </div>
                <div>Flashing status: {lamp.flashing_status}</div>
              </div>
            ))}
          </CardBody>
        </>
      ) : (
        <></>
      )}
    </Card>
  );
}
