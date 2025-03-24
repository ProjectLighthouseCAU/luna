import { AuthContext } from '@luna/contexts/api/auth/AuthContext';
import { useAdminStatus } from '@luna/hooks/useAdminStatus';
import { DisplayInspectorActionsCard } from '@luna/screens/home/displays/DisplayInspectorActionsCard';
import { DisplayInspectorApiTokenCard } from '@luna/screens/home/displays/DisplayInspectorApiTokenCard';
import { DisplayInspectorInputCard } from '@luna/screens/home/displays/DisplayInspectorInputCard';
import { InputCapabilities } from '@luna/screens/home/displays/helpers/InputCapabilities';
import { InputConfig } from '@luna/screens/home/displays/helpers/InputConfig';
import { InputState } from '@luna/screens/home/displays/helpers/InputState';
// import { DisplayInspectorOptionsCard } from '@luna/screens/home/displays/DisplayInspectorOptionsCard';
import { useContext } from 'react';

export interface DisplayInspectorProps {
  username: string;
  inputState: InputState;
  inputConfig: InputConfig;
  setInputConfig: (inputConfig: InputConfig) => void;
  inputCapabilities: InputCapabilities;
}

export function DisplayInspector({
  username,
  inputState,
  inputConfig,
  setInputConfig,
  inputCapabilities,
}: DisplayInspectorProps) {
  const { user: me } = useContext(AuthContext);
  const { isAdmin } = useAdminStatus();
  const isMeOrAdmin = username === me?.username || isAdmin;

  return (
    <div className="flex flex-col space-y-3 md:w-[200px]">
      <DisplayInspectorActionsCard username={username} />
      {/* <DisplayInspectorOptionsCard isEditable={isMeOrAdmin} /> */}
      {isMeOrAdmin ? (
        <>
          <DisplayInspectorApiTokenCard username={username} />
          <DisplayInspectorInputCard
            username={username}
            inputState={inputState}
            inputConfig={inputConfig}
            setInputConfig={setInputConfig}
            inputCapabilities={inputCapabilities}
          />
        </>
      ) : null}
    </div>
  );
}
