import { isAdmin } from '@luna/api/auth/utils';
import { AuthContext } from '@luna/contexts/AuthContext';
import { DisplayInspectorApiTokenCard } from '@luna/screens/home/displays/DisplayInspectorApiTokenCard';
import { DisplayInspectorInputCard } from '@luna/screens/home/displays/DisplayInspectorInputCard';
import { DisplayInspectorOptionsCard } from '@luna/screens/home/displays/DisplayInspectorOptionsCard';
import { useContext } from 'react';

export interface DisplayInspectorProps {
  username: string;
}

export function DisplayInspector({ username }: DisplayInspectorProps) {
  const { user: me } = useContext(AuthContext);
  const isMeOrAdmin = username === me?.username || (me !== null && isAdmin(me));

  return (
    <div className="flex flex-col space-y-3">
      <DisplayInspectorOptionsCard isEditable={isMeOrAdmin} />
      {isMeOrAdmin ? (
        <>
          <DisplayInspectorApiTokenCard />
          <DisplayInspectorInputCard />
        </>
      ) : null}
    </div>
  );
}
