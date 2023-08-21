import { DisplayCard } from '@luna/components/DisplayCard';
import { ModelContext } from '@luna/contexts/ModelContext';
import { HomeContent } from '@luna/screens/home/HomeContent';
import { useContext } from 'react';
import { useParams } from 'react-router-dom';

export function DisplayView() {
  const { username } = useParams();
  const { userModels } = useContext(ModelContext);

  return (
    <HomeContent title={`${username}'s Display`}>
      {/* TODO: Handle errors */}
      <DisplayCard
        username={username!}
        frame={userModels.get(username!)!.frame}
      />
    </HomeContent>
  );
}
