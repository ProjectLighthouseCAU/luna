import { DisplayCard } from '@luna/views/DisplayCard';
import { Grid, Pagination } from '@nextui-org/react';
import React from 'react';

export function Displays() {
  // TODO
  return (
    <Grid.Container>
      <Grid>
        <Grid.Container gap={1}>
          {[...new Array(10)].map(() => (
            <Grid xs={6} sm={4} md={2}>
              <DisplayCard username="Test" />
            </Grid>
          ))}
        </Grid.Container>
        <Pagination total={20} initialPage={1} />
      </Grid>
    </Grid.Container>
  );
}
