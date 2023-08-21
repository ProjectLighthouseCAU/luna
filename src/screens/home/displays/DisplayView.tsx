import { DisplayCard } from '@luna/components/DisplayCard';
import { ModelContext } from '@luna/contexts/ModelContext';
import { HomeContent } from '@luna/screens/home/HomeContent';
import { useContext } from 'react';
import { useParams } from 'react-router-dom';

export function DisplayView() {
  const { username } = useParams() as { username: string };
  const { userModels } = useContext(ModelContext);

  const userModel = userModels.get(username);

  return (
    <HomeContent title={`${username}'s Display`}>
      {userModel ? (
        <DisplayCard username={username} frame={userModel.frame} />
      ) : (
        // TODO: Improve error message, perhaps add a link back to /displays?
        <p>No model found!</p>
      )}
    </HomeContent>
  );
}
