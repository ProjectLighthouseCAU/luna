import { DisplayCard } from '@luna/screens/home/DisplayCard';
import { Pagination } from '@nextui-org/react';
import React from 'react';

export function Displays() {
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-wrap">
        {[...new Array(10)].map((_, i) => (
          <div key={`${i}`}>
            <DisplayCard username={`Test ${i}`} />
          </div>
        ))}
      </div>
      <Pagination total={20} initialPage={1} />
    </div>
  );
}
