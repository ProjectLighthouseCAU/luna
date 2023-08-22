import { ModelContext } from '@luna/contexts/ModelContext';
import { DisplayCard } from '@luna/components/DisplayCard';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { HomeContent } from '@luna/screens/home/HomeContent';

export function DisplaysView() {
  const { userModels } = useContext(ModelContext);

  return (
    <HomeContent title="Displays">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-wrap">
          {[...userModels.entries()]
            .sort(([u1], [u2]) => u1.localeCompare(u2))
            .map(([username, userModel], i) => (
              <Link to={username} key={`${i}`}>
                <DisplayCard username={username} frame={userModel.frame} />
              </Link>
            ))}
        </div>
      </div>
    </HomeContent>
  );
}
