import { DISPLAY_ASPECT_RATIO, Display } from '@luna/components/Display';
import { ModelContext } from '@luna/contexts/ModelContext';
import { useEventListener } from '@luna/hooks/useEventListener';
import { HomeContent } from '@luna/screens/home/HomeContent';
import { throttle } from '@luna/utils/schedule';
import { useContext, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

export function DisplayView() {
  const { username } = useParams() as { username: string };
  const { userModels } = useContext(ModelContext);

  const [maxSize, setMaxSize] = useState({ width: 0, height: 0 });
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const userModel = userModels.get(username);

  const onResize = useMemo(
    () =>
      throttle(() => {
        const wrapper = wrapperRef.current;
        if (wrapper) {
          setMaxSize({
            width: wrapper.clientWidth,
            height: wrapper.clientHeight,
          });
        }
      }, 50),
    []
  );

  useEventListener(window, 'resize', onResize, { fireImmediately: true });

  const width = Math.min(maxSize.width, maxSize.height * DISPLAY_ASPECT_RATIO);

  return (
    <HomeContent title={`${username}'s Display`}>
      {userModel ? (
        <div ref={wrapperRef} className="flex flex-row justify-center h-full">
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
