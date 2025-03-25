import { DisplayInspectorAnimatorCard } from '@luna/screens/home/displays/DisplayInspectorAnimatorCard';

export interface DisplayInspectorAnimatorTabProps {
  username: string;
}

export function DisplayInspectorAnimatorTab({
  username,
}: DisplayInspectorAnimatorTabProps) {
  return (
    <>
      <DisplayInspectorAnimatorCard username={username} />
    </>
  );
}
