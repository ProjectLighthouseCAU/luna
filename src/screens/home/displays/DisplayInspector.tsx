import { AuthContext } from '@luna/contexts/api/auth/AuthContext';
import { DisplayInspectorApiTokenCard } from '@luna/screens/home/displays/DisplayInspectorApiTokenCard';
import { DisplayInspectorInputCard } from '@luna/screens/home/displays/DisplayInspectorInputCard';
import { InputConfig } from '@luna/screens/home/displays/helpers/InputConfig';
// import { DisplayInspectorOptionsCard } from '@luna/screens/home/displays/DisplayInspectorOptionsCard';
import { useContext } from 'react';

export interface DisplayInspectorProps {
  username: string;
  inputConfig: InputConfig;
  setInputConfig: (inputConfig: InputConfig) => void;
}

export function DisplayInspector({
  username,
  inputConfig,
  setInputConfig,
}: DisplayInspectorProps) {
  const { user: me } = useContext(AuthContext);
  const isMeOrAdmin =
    username === me?.username ||
    me?.roles.find(role => role.name === 'admin') !== undefined;

  return (
    <div className="flex flex-col space-y-3">
      {/* <DisplayInspectorOptionsCard isEditable={isMeOrAdmin} /> */}
      {isMeOrAdmin ? (
        <>
          <DisplayInspectorApiTokenCard />
          <DisplayInspectorInputCard
            username={username}
            inputConfig={inputConfig}
            setInputConfig={setInputConfig}
          />
        </>
      ) : null}
    </div>
  );
}
