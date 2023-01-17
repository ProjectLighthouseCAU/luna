import { DisplayCard } from '@luna/views/DisplayCard';
import { Grid, Pagination } from '@nextui-org/react';
import React from 'react';

export function Displays() {
  // TODO
  return (
    <Grid.Container>
      <Grid>
        <Grid.Container gap={1}>
          {[...new Array(10)].map((_, i) => (
            <Grid key={`${i}`} xs={6} sm={4} md={2}>
              <DisplayCard username={`Test ${i}`} />
            </Grid>
          ))}
        </Grid.Container>
        <Pagination total={20} initialPage={1} />
      </Grid>
    </Grid.Container>
  );
}
