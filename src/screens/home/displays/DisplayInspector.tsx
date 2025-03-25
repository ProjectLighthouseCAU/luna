import {
  DisplayInspectorAnimatorTab,
  DisplayInspectorAnimatorTabProps,
} from '@luna/screens/home/displays/DisplayInspectorAnimatorTab';
import {
  DisplayInspectorGeneralTab,
  DisplayInspectorGeneralTabProps,
} from '@luna/screens/home/displays/DisplayInspectorGeneralTab';
import { DisplayInspectorTab } from '@luna/screens/home/displays/helpers/DisplayInspectorTab';

export interface DisplayInspectorProps
  extends DisplayInspectorGeneralTabProps,
    DisplayInspectorAnimatorTabProps {
  tab: DisplayInspectorTab;
}

export function DisplayInspector(props: DisplayInspectorProps) {
  return (
    <div className="flex flex-col gap-3 md:w-[200px]">
      <DisplayInspectorContent {...props} />
    </div>
  );
}

function DisplayInspectorContent(props: DisplayInspectorProps) {
  switch (props.tab) {
    case 'general':
      return <DisplayInspectorGeneralTab {...props} />;
    case 'animator':
      return <DisplayInspectorAnimatorTab {...props} />;
  }
}
