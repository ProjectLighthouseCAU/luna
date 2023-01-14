import { Grid } from '@nextui-org/react';
import React from 'react';
import { Outlet, Link } from 'react-router-dom';

export function HomeScreen() {
  return (
    <Grid.Container gap={4}>
      <Grid>
        <ul>
          <li>
            <Link to="admin">Admin</Link>
          </li>
          <li>
            <Link to="displays">Displays</Link>
          </li>
        </ul>
      </Grid>
      <Grid>
        <Outlet />
      </Grid>
    </Grid.Container>
  );
}
