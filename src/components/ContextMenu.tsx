import { Dropdown, DropdownTrigger } from '@heroui/react';
import { ReactNode, useEffect, useRef, useState } from 'react';

export interface ContextMenuProps {
  menu: ReactNode;
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
  }, [divRef]);

  return (
    <div ref={divRef}>
      <Dropdown isOpen={isShown} onOpenChange={setShown} isTriggerDisabled>
        <DropdownTrigger onPress={() => console.log('test')}>
          {children}
        </DropdownTrigger>
        {menu}
      </Dropdown>
    </div>
  );
}
