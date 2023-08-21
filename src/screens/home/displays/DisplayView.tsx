import { Display } from '@luna/components/Display';
import { ModelContext } from '@luna/contexts/ModelContext';
import { HomeContent } from '@luna/screens/home/HomeContent';
import { useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

export function DisplayView() {
  const { username } = useParams() as { username: string };
  const { userModels } = useContext(ModelContext);

  const [width, setWidth] = useState(0);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const userModel = userModels.get(username);

  // TODO: Polish the width logic (perhaps use height instead?) and add an event listener

  useEffect(() => {
    const wrapper = wrapperRef.current!;
    if (wrapper) {
      setWidth(wrapper.clientWidth);
      const listener = () => {
        setWidth(wrapper.clientWidth);
      };
      window.addEventListener('resize', listener);
      return () => window.removeEventListener('resize', listener);
    } else {
      return () => {};
    }
  }, []);

  return (
    <HomeContent title={`${username}'s Display`}>
      {userModel ? (
        <div ref={wrapperRef} className="w-full">
          <Display frame={userModel.frame} width={width} />
        </div>
      ) : (
        // TODO: Improve error message, perhaps add a link back to /displays?
        <p>No model found!</p>
      )}
    </HomeContent>
  );
}
