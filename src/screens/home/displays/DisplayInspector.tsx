import { DisplayInspectorApiTokenCard } from '@luna/screens/home/displays/DisplayInspectorApiTokenCard';
import { DisplayInspectorInputCard } from '@luna/screens/home/displays/DisplayInspectorInputCard';

export function DisplayInspector() {
  // TODO: Implement actual functionality
  return (
    <div className="flex flex-col space-y-3">
      <DisplayInspectorApiTokenCard />
      <DisplayInspectorInputCard />
    </div>
  );
}
