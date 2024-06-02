import { Breakpoint, useBreakpoint } from '@luna/hooks/useBreakpoint';
import { HomeContentContext } from '@luna/screens/home/HomeContent';
import { Sidebar } from '@luna/screens/home/sidebar/Sidebar';
import { Button } from '@nextui-org/react';
import { IconMenu2 } from '@tabler/icons-react';
import React, {
  ReactNode,
  useCallback,
  useLayoutEffect,
  useState,
} from 'react';
import { Outlet, useLocation } from 'react-router-dom';

export function HomeScreen() {
  const location = useLocation();
  const breakpoint = useBreakpoint();
  const isCompact = breakpoint <= Breakpoint.Sm;
  const [isExpanded, setExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const [toolbar, setToolbar] = useState<ReactNode>();

  const outletContext: HomeContentContext = { setTitle, setToolbar };

  useLayoutEffect(() => {
    setExpanded(false);
  }, [location]);

  const toggleExpanded = useCallback(() => setExpanded(e => !e), []);

  return (
    <div
      className={`flex ${isCompact ? 'flex-col h-full' : 'flex-row'} h-full`}
    >
      {!isCompact ? (
        <div className="grow-0 shrink-0 basis-64 sticky top-0 h-full p-5">
          <Sidebar isCompact={isCompact} />
        </div>
      ) : null}
      <div className="flex flex-col space-y-4 grow p-5">
        <div className="flex flex-row items-center space-x-4">
          {isCompact ? (
            <Button isIconOnly onPress={toggleExpanded}>
              <IconMenu2 />
            </Button>
          ) : null}
          <div className="grow flex flex-row justify-between">
            <h2 className="text-3xl">{title}</h2>
            {toolbar}
          </div>
        </div>
        {isCompact && isExpanded ? <Sidebar isCompact={isCompact} /> : null}
        <div className="grow">
          <Outlet context={outletContext} />
        </div>
      </div>
    </div>
  );
}
