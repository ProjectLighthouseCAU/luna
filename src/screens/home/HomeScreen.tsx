import { Breakpoint, useBreakpoint } from '@luna/hooks/useBreakpoint';
import { HomeContentContext } from '@luna/screens/home/HomeContent';
import { Sidebar } from '@luna/screens/home/sidebar/Sidebar';
import { Button, Tooltip } from '@nextui-org/react';
import {
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarLeftExpand,
  IconMenu2,
} from '@tabler/icons-react';
import { ReactNode, useCallback, useLayoutEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

export function HomeScreen() {
  const location = useLocation();
  const breakpoint = useBreakpoint();
  const isCompact = breakpoint <= Breakpoint.Sm;
  const [isExpanded, setExpanded] = useState(!isCompact);
  const [title, setTitle] = useState('');
  const [toolbar, setToolbar] = useState<ReactNode>();

  const outletContext: HomeContentContext = { setTitle, setToolbar };

  useLayoutEffect(() => {
    if (isCompact) {
      setExpanded(false);
    }
  }, [isCompact, location]);

  const toggleExpanded = useCallback(() => setExpanded(e => !e), []);

  return (
    <div
      className={`flex ${isCompact ? 'flex-col h-full' : 'flex-row h-screen'}`}
    >
      {!isCompact && isExpanded ? (
        <div className="grow-0 shrink-0 basis-64 sticky top-0 h-screen p-5">
          <Sidebar isCompact={isCompact} />
        </div>
      ) : null}
      <div className="flex flex-col grow">
        <div className="flex flex-row items-center space-x-4 sticky top-0 z-50 p-5 bg-white/70 dark:bg-black/30 backdrop-blur-2xl">
          <Tooltip
            content={isCompact ? 'Toggle the menu' : 'Toggle the sidebar'}
          >
            <Button isIconOnly onPress={toggleExpanded}>
              {isCompact ? (
                <IconMenu2 />
              ) : isExpanded ? (
                <IconLayoutSidebarLeftCollapse />
              ) : (
                <IconLayoutSidebarLeftExpand />
              )}
            </Button>
          </Tooltip>
          <div className="grow flex flex-row justify-between">
            <h2 className="text-3xl">{title}</h2>
            {toolbar}
          </div>
        </div>
        {isCompact && isExpanded ? (
          <div className="p-5">
            <Sidebar isCompact={isCompact} />
          </div>
        ) : null}
        <div className="grow p-5">
          <Outlet context={outletContext} />
        </div>
      </div>
    </div>
  );
}
