import { IconError404 } from '@tabler/icons-react';

export function NotFoundScreen() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <IconError404 size="64" />
      <h2 className="text-xl">Sorry, the page could not be found</h2>
    </div>
  );
}
