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

export interface DisplayInspectorGeneralTabProps {
  username: string;
  inputState: InputState;
  inputConfig: InputConfig;
  setInputConfig: (inputConfig: InputConfig) => void;
  inputCapabilities: InputCapabilities;
}

export function DisplayInspectorGeneralTab({
  username,
  inputState,
  inputConfig,
  setInputConfig,
  inputCapabilities,
}: DisplayInspectorGeneralTabProps) {
  const { user: me } = useContext(AuthContext);
  const { isAdmin } = useAdminStatus();
  const isMeOrAdmin = username === me?.username || isAdmin;

  return (
    <>
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
    </>
  );
}
