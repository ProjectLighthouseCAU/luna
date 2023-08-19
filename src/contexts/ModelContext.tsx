import { LIGHTHOUSE_FRAME_BYTES } from 'nighthouse/browser';
import { ReactNode, createContext, useEffect, useState } from 'react';

export interface UserModel {
  readonly frame: Uint8Array;
}

export interface Model {
  readonly userModels: Map<string, UserModel>;
}

export const ModelContext = createContext<Model>({
  userModels: new Map(),
});

interface ModelContextProviderProps {
  children: ReactNode;
}

export function ModelContextProvider({ children }: ModelContextProviderProps) {
  const [userModels, setUserModels] = useState(new Map<string, UserModel>());

  // TODO: Use actual data
  useEffect(() => {
    const newUserModels = new Map<string, UserModel>();
    for (const user of ['Alice', 'Bob', 'Charles']) {
      newUserModels.set(user, {
        frame: new Uint8Array(LIGHTHOUSE_FRAME_BYTES).map(() =>
          Math.floor(Math.random() * 255)
        ),
      });
    }
    setUserModels(newUserModels);
  }, []);

  const model = { userModels };

  return (
    <ModelContext.Provider value={model}>{children}</ModelContext.Provider>
  );
}
