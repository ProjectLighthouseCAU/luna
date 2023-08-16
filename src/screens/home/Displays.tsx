import { DisplayCard } from '@luna/screens/home/DisplayCard';
import { Pagination } from '@nextui-org/react';
import React from 'react';

export function Displays() {
  // TODO: Responsive/grid layout
  return (
    <div>
      {[...new Array(10)].map((_, i) => (
        <div key={`${i}`}>
          <DisplayCard username={`Test ${i}`} />
        </div>
      ))}
      <Pagination total={20} initialPage={1} />
    </div>
  );
}
