import { ModelContext } from '@luna/contexts/ModelContext';
import { DisplayCard } from '@luna/components/DisplayCard';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

export function DisplaysView() {
  const { userModels } = useContext(ModelContext);

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-wrap">
        {[...userModels.entries()]
          .sort(([u1], [u2]) => u1.localeCompare(u2))
          .map(([username, userModel], i) => (
            <div key={`${i}`}>
              <Link to={username}>
                <DisplayCard username={username} frame={userModel.frame} />
              </Link>
            </div>
          ))}
      </div>
    </div>
  );
}
