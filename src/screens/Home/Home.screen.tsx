import { useRouteNode } from '@luna/hooks/RouteNode';
import { Sidebar } from '@luna/views/Sidebar/Sidebar.view';
import { Grid, Text } from '@nextui-org/react';
import React from 'react';
import { Outlet } from 'react-router-dom';

export function HomeScreen() {
  const routeNode = useRouteNode();

  return (
    <Grid.Container gap={4}>
      <Grid>
        <Sidebar />
      </Grid>
      <Grid>
        <Text h2>{routeNode?.displayName}</Text>
        <Outlet />
      </Grid>
    </Grid.Container>
  );
}
