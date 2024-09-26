import { WindowDimensionsContext } from '@luna/contexts/WindowDimensionsContext';
import { Breakpoint, useBreakpoint } from '@luna/hooks/useBreakpoint';
import { LiveDisplay } from '@luna/components/LiveDisplay';
import { LoginCard } from '@luna/screens/login/LoginCard';
import { SignupCard } from '@luna/screens/login/SignupCard';
import { useContext, useState } from 'react';
import { DISPLAY_ASPECT_RATIO } from '@luna/components/Display';
import { Logo } from '@luna/components/Logo';
import { motion } from 'framer-motion';

export function LoginScreen() {
  const { width, height } = useContext(WindowDimensionsContext);
  const breakpoint = useBreakpoint();

  const factor: number = 0.9;
  const maxWidth = Breakpoint.Md;
  const maxHeight = maxWidth / DISPLAY_ASPECT_RATIO;

  const isHorizontal = breakpoint >= Breakpoint.Lg && height > 600;
  const displayWidth: number =
    isHorizontal && height < maxHeight
      ? height * DISPLAY_ASPECT_RATIO * factor
      : Math.min(width, maxWidth) * factor;

  const [showSignup, setShowSignup] = useState(false);

  return (
    <div
      className={`h-full flex ${
        isHorizontal ? 'flex-row justify-center' : 'flex-col mt-4'
      } items-center ${isHorizontal ? 'space-x-6' : 'space-y-6'}`}
    >
      <div className="flex flex-col space-y-8 items-center">
        {!showSignup && isHorizontal ? <Logo /> : null}
        <motion.h1 layout className="text-4xl font-bold">
          Project Lighthouse
        </motion.h1>
        <motion.div layout className="min-w-80">
          {showSignup ? (
            <SignupCard showLogin={() => setShowSignup(false)} />
          ) : (
            <LoginCard showSignup={() => setShowSignup(true)} />
          )}
        </motion.div>
      </div>
      <LiveDisplay width={displayWidth} />
    </div>
  );
}
