import { IconBarrierBlock } from '@tabler/icons-react';

export function UnderConstruction() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <IconBarrierBlock size="64" />
      <h2 className="text-xl">Under construction...</h2>
    </div>
  );
}
