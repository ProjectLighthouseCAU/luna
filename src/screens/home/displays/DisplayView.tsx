import { DISPLAY_ASPECT_RATIO, Display } from '@luna/components/Display';
import { ModelContext } from '@luna/contexts/ModelContext';
import { HomeContent } from '@luna/screens/home/HomeContent';
import { useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

export function DisplayView() {
  const { username } = useParams() as { username: string };
  const { userModels } = useContext(ModelContext);

  const [maxSize, setMaxSize] = useState({ width: 0, height: 0 });
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const userModel = userModels.get(username);

  useEffect(() => {
    const wrapper = wrapperRef.current!;
    if (wrapper) {
      const listener = () => {
        setMaxSize({
          width: wrapper.clientWidth,
          height: wrapper.clientHeight,
        });
      };
      listener();
      window.addEventListener('resize', listener);
      return () => window.removeEventListener('resize', listener);
    } else {
      return () => {};
    }
  }, []);

  const width = Math.min(maxSize.width, maxSize.height * DISPLAY_ASPECT_RATIO);

  return (
    <HomeContent title={`${username}'s Display`}>
      {userModel ? (
        <div ref={wrapperRef} className="h-full">
          <div className="absolute">
            <Display frame={userModel.frame} width={width} />
          </div>
        </div>
      ) : (
        // TODO: Improve error message, perhaps add a link back to /displays?
        <p>No model found!</p>
      )}
    </HomeContent>
  );
}
