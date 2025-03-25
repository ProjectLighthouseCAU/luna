import { Breakpoint, useBreakpoint } from '@luna/hooks/useBreakpoint';
import { HomeContentContext } from '@luna/screens/home/HomeContent';
import { Sidebar } from '@luna/screens/home/sidebar/Sidebar';
import { Button } from '@heroui/react';
import { IconMenu2 } from '@tabler/icons-react';
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { QuickSwitcherModal } from '@luna/modals/QuickSwitcherModal';
import {
  defaultHomeContentLayout,
  HomeContentLayout,
} from '@luna/screens/home/helpers/HomeContentLayout';

export function HomeScreen() {
  const location = useLocation();
  const breakpoint = useBreakpoint();

  const isCompact = breakpoint <= Breakpoint.Sm;

  const [isExpanded, setExpanded] = useState(false);
  const [isQuickSwitcherOpen, setQuickSwitcherOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [toolbar, setToolbar] = useState<ReactNode>();
  const [layout, setLayout] = useState<HomeContentLayout>(
    defaultHomeContentLayout
  );

  const outletContext: HomeContentContext = { setTitle, setToolbar, setLayout };

  useLayoutEffect(() => {
    setExpanded(false);
  }, [location]);

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.code === 'KeyK') {
        setQuickSwitcherOpen(isOpen => !isOpen);
        e.preventDefault();
      }
    };
    document.addEventListener('keydown', listener);
    return () => {
      document.removeEventListener('keydown', listener);
    };
  }, []);

  const toggleExpanded = useCallback(() => {
    if (isCompact && !isExpanded) {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 50);
    }
    setExpanded(e => !e);
  }, [isCompact, isExpanded]);

  return (
    <div
      className={`flex ${isCompact ? 'flex-col' : 'flex-row'} ${isCompact || layout === 'fullScreen' ? 'h-full' : ''}`}
    >
      {!isCompact ? (
        <div className="grow-0 shrink-0 basis-64 sticky top-0 h-screen p-5">
          <Sidebar isCompact={isCompact} />
        </div>
      ) : null}
      <div className="flex flex-col grow">
        <div className="flex flex-row space-x-4 sticky top-0 z-50 h-[75px] p-5 bg-white/70 dark:bg-black/30 backdrop-blur-2xl">
          {isCompact ? (
            <Button isIconOnly onPress={toggleExpanded}>
              <IconMenu2 />
            </Button>
          ) : null}
          <div className="grow flex flex-row justify-between">
            <h2 className="text-3xl">{title}</h2>
            <div className="flex flex-row items-center">{toolbar}</div>
          </div>
        </div>
        {isCompact && isExpanded ? (
          <div className="p-5">
            <Sidebar isCompact={isCompact} />
          </div>
        ) : null}
        <div
          className={`grow p-5 ${layout === 'fullScreen' ? 'h-[calc(100%-75px)]' : ''}`}
        >
          <Outlet context={outletContext} />
        </div>
      </div>
      <QuickSwitcherModal
        isOpen={isQuickSwitcherOpen}
        setOpen={setQuickSwitcherOpen}
      />
    </div>
  );
}
