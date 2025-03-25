import { Center } from '@luna/components/Center';
import { IconBarrierBlock } from '@tabler/icons-react';

export function UnderConstruction() {
  return (
    <Center>
      <IconBarrierBlock size="64" />
      <h2 className="text-xl select-none">Under construction...</h2>
    </Center>
  );
}
