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
    const listener = (e: MouseEvent) => {
      e.preventDefault();
      setShown(isShown => !isShown);
    };
    div.addEventListener('contextmenu', listener);
    return () => {
      div.removeEventListener('contextmenu', listener);
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
