import { Center } from '@luna/components/Center';
import { Logo } from '@luna/components/Logo';
import { Spinner } from '@heroui/react';

export function LoadingScreen() {
  return (
    <Center>
      <div className="flex flex-col space-y-16">
        <Logo />
        <Spinner />
      </div>
    </Center>
  );
}
