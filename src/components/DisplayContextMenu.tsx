import { DropdownItem, DropdownMenu } from '@heroui/react';
import { DisplayActionsMenu } from '@luna/components/DisplayActionsMenu';

export interface DisplayContextMenuProps {
  username: string;
}

export function DisplayContextMenu({ username }: DisplayContextMenuProps) {
  return (
    <DisplayActionsMenu username={username}>
      {({ items }) => (
        <DropdownMenu>
          {items.map(item => (
            <DropdownItem
              key={item.key}
              onPress={item.onPress}
              className={item.danger ? 'text-danger' : ''}
              color={item.danger ? 'danger' : undefined}
            >
              {item.label}
            </DropdownItem>
          ))}
        </DropdownMenu>
      )}
    </DisplayActionsMenu>
  );
}
