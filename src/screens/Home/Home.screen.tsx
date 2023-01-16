import { Sidebar } from '@luna/views/Sidebar/Sidebar.view';
import { Grid } from '@nextui-org/react';
import React from 'react';
import { Outlet } from 'react-router-dom';

export function HomeScreen() {
  return (
    <Grid.Container gap={4}>
      <Grid>
        <Sidebar />
      </Grid>
      <Grid>
        <Outlet />
      </Grid>
    </Grid.Container>
  );
}
