import { Dropdown, DropdownTrigger } from '@heroui/react';
import { ReactNode, useEffect, useRef, useState } from 'react';

export interface ContextMenuProps {
  menu?: ReactNode;
  children: ReactNode;
}

export function ContextMenu({ menu, children }: ContextMenuProps) {
  const [isShown, setShown] = useState(false);
  const divRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const div = divRef.current;
    if (div === null) {
      return;
    }
    const onContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      setShown(isShown => !isShown);
    };

    const longTouchDelayMs = 800;
    let longTouchTimer: number | null = null;

    const onTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      if (e !== null) {
        longTouchTimer = window.setTimeout(() => {
          setShown(true);
        }, longTouchDelayMs);
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (longTouchTimer !== null) {
        window.clearTimeout(longTouchTimer);
        longTouchTimer = null;
      }
    };

    div.addEventListener('contextmenu', onContextMenu);
    div.addEventListener('touchstart', onTouchStart);
    div.addEventListener('touchend', onTouchEnd);

    return () => {
      div.removeEventListener('contextmenu', onContextMenu);
      div.removeEventListener('touchstart', onTouchStart);
      div.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  return menu ? (
    <div ref={divRef}>
      {children}
      <Dropdown isOpen={isShown} onOpenChange={setShown}>
        <DropdownTrigger>
          {/* Workaround: We don't want the dropdown to trigger on simple clicks therefore we give it an empty div. */}
          <div />
        </DropdownTrigger>
        {menu}
      </Dropdown>
    </div>
  ) : (
    <>{children}</>
  );
}
