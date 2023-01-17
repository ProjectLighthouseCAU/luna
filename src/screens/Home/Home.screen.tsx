import { Breakpoint, useBreakpoint } from '@luna/hooks/Breakpoint';
import { useRouteNode } from '@luna/hooks/RouteNode';
import { Sidebar } from '@luna/views/Sidebar/Sidebar.view';
import { Button, Container, Grid, Row, Text } from '@nextui-org/react';
import { IconMenu2 } from '@tabler/icons';
import React from 'react';
import { Outlet } from 'react-router-dom';

export function HomeScreen() {
  const routeNode = useRouteNode();
  const breakpoint = useBreakpoint();
  const compact = breakpoint <= Breakpoint.Sm;

  return (
    <Grid.Container gap={4}>
      {!compact ? (
        <Grid>
          <Sidebar />
        </Grid>
      ) : null}
      <Grid>
        <Grid.Container alignItems="baseline">
          {compact ? (
            <Button light auto>
              <IconMenu2 />
            </Button>
          ) : null}
          <Text h2>{routeNode?.displayName}</Text>
        </Grid.Container>
        <Outlet />
      </Grid>
    </Grid.Container>
  );
}
