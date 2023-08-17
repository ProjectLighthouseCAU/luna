import { WindowDimensionsContext } from '@luna/contexts/WindowDimensionsContext';
import { Breakpoint, useBreakpoint } from '@luna/hooks/useBreakpoint';
import { LiveDisplay } from '@luna/components/LiveDisplay';
import { LoginCard } from '@luna/screens/login/LoginCard';
import { useContext } from 'react';

export function LoginScreen() {
  const { width } = useContext(WindowDimensionsContext);
  const breakpoint = useBreakpoint();

  let displayWidth: number;
  switch (breakpoint) {
    case Breakpoint.Xs:
    case Breakpoint.Sm:
    case Breakpoint.Md:
      displayWidth = width * 0.8;
      break;
    case Breakpoint.Lg:
      displayWidth = width / 2;
      break;
    default:
      displayWidth = Breakpoint.Xl / 2;
      break;
  }

  return (
    <div className="h-full flex justify-center items-center space-x-4">
      <div className="flex flex-col space-y-4 items-center">
        <h1 className="text-3xl font-bold">Project Lighthouse</h1>
        <LoginCard />
      </div>
      <LiveDisplay width={displayWidth} />
    </div>
  );
}
