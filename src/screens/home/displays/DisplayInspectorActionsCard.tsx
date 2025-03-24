import { Button } from '@heroui/react';
import { DisplayActionsMenu } from '@luna/components/DisplayActionsMenu';
import { TitledCard } from '@luna/components/TitledCard';
import { IconTarget } from '@tabler/icons-react';

export interface DisplayInspectorActionsCardProps {
  username: string;
}

export function DisplayInspectorActionsCard({
  username,
}: DisplayInspectorActionsCardProps) {
  return (
    <TitledCard icon={<IconTarget />} title="Actions" isCollapsible>
      <DisplayActionsMenu username={username}>
        {({ items }) => (
          <div className="flex flex-col gap-1.5">
            {items.map(item => (
              <Button
                key={item.key}
                onPress={item.onPress}
                variant="ghost"
                size="sm"
                color={item.danger ? 'danger' : undefined}
              >
                {item.label}
              </Button>
            ))}
          </div>
        )}
      </DisplayActionsMenu>
    </TitledCard>
  );
}
