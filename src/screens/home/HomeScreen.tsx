import { Breakpoint, useBreakpoint } from '@luna/hooks/useBreakpoint';
import { useRouteNode } from '@luna/hooks/useRouteNode';
import { Sidebar } from '@luna/screens/home/Sidebar';
import { Button } from '@nextui-org/react';
import { IconMenu2 } from '@tabler/icons-react';
import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

export function HomeScreen() {
  const routeNode = useRouteNode();
  const breakpoint = useBreakpoint();
  const isCompact = breakpoint <= Breakpoint.Sm;
  const route = useRouteNode();
  const [isExpanded, setExpanded] = useState(false);

  useEffect(() => {
    setExpanded(false);
  }, [route]);

  return (
    <div className="flex flex-row p-6 space-x-6">
      {!isCompact ? <Sidebar /> : null}
      <div className="space-y-4">
        <div className="flex flex-row space-x-4">
          {isCompact ? (
            <Button isIconOnly onPress={() => setExpanded(!isExpanded)}>
              <IconMenu2 />
            </Button>
          ) : null}
          <h2 className="text-3xl">{routeNode?.displayName}</h2>
        </div>
        {isCompact && isExpanded ? <Sidebar /> : null}
        <Outlet />
      </div>
    </div>
  );
}
