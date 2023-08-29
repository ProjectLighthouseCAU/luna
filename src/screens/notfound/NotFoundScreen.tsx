import { Center } from '@luna/components/Center';
import { IconError404 } from '@tabler/icons-react';

export function NotFoundScreen() {
  return (
    <Center>
      <IconError404 size="64" />
      <h2 className="text-xl">Sorry, the page could not be found</h2>
    </Center>
  );
}
