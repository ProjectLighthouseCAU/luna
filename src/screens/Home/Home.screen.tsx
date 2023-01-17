import { Breakpoint, useBreakpoint } from '@luna/hooks/Breakpoint';
import { useRouteNode } from '@luna/hooks/RouteNode';
import { Sidebar } from '@luna/views/Sidebar/Sidebar.view';
import { Button, Grid, Row, Text } from '@nextui-org/react';
import { IconMenu2 } from '@tabler/icons';
import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

export function HomeScreen() {
  const routeNode = useRouteNode();
  const breakpoint = useBreakpoint();
  const isCompact = breakpoint <= Breakpoint.Sm;
  const route = useRouteNode();
  const [isExpanded, setExpanded] = useState(false);

  useEffect(() => {
    setExpanded(false);
  }, [route]);

  return (
    <Grid.Container gap={4}>
      {!isCompact ? (
        <Grid sm={2}>
          <Sidebar />
        </Grid>
      ) : null}
      <Grid sm={10}>
        <Grid.Container>
          <Grid>
            <Row align="baseline">
              {isCompact ? (
                <Button light auto onPress={() => setExpanded(!isExpanded)}>
                  <IconMenu2 />
                </Button>
              ) : null}
              <Text h2>{routeNode?.displayName}</Text>
            </Row>
            {isCompact && isExpanded ? <Sidebar /> : null}
            <Outlet />
          </Grid>
        </Grid.Container>
      </Grid>
    </Grid.Container>
  );
}
