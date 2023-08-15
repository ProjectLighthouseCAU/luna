import { WindowDimensionsContext } from '@luna/contexts/WindowDimensionsContext';
import { Breakpoint, useBreakpoint } from '@luna/hooks/useBreakpoint';
import { LiveDisplay } from '@luna/components/LiveDisplay';
import { LoginCard } from '@luna/screens/login/LoginCard';
import { Grid } from '@nextui-org/react';
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
    <Grid.Container gap={4} justify="center" alignItems="center">
      <Grid>
        <Grid.Container justify="center" alignItems="center">
          <Grid>
            <h1>Project Lighthouse</h1>
            <LoginCard />
          </Grid>
        </Grid.Container>
      </Grid>
      <Grid>
        <LiveDisplay width={displayWidth} />
      </Grid>
    </Grid.Container>
  );
}
