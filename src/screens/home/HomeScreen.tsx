import { Breakpoint, useBreakpoint } from '@luna/hooks/useBreakpoint';
import { useRouteNode } from '@luna/hooks/useRouteNode';
import { Sidebar } from '@luna/screens/home/Sidebar';
import { Button, Grid, Row, Text } from '@nextui-org/react';
import { IconMenu2 } from '@tabler/icons-react';
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
              <h2>{routeNode?.displayName}</h2>
            </Row>
            {isCompact && isExpanded ? <Sidebar /> : null}
            <Outlet />
          </Grid>
        </Grid.Container>
      </Grid>
    </Grid.Container>
  );
}
