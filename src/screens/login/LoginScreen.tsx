import { WindowDimensionsContext } from '@luna/contexts/WindowDimensionsContext';
import { Breakpoint, useBreakpoint } from '@luna/hooks/useBreakpoint';
import { LiveDisplay } from '@luna/components/LiveDisplay';
import { LoginCard } from '@luna/screens/login/LoginCard';
import { SignupCard } from '@luna/screens/login/SignupCard';
import { useContext, useState } from 'react';
import { DISPLAY_ASPECT_RATIO } from '@luna/components/Display';
import { Logo } from '@luna/components/Logo';
import ReactCardFlip from 'react-card-flip';
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
      <div
        className={`flex flex-col space-y-8 items-center ${
          // NOTE: The overflow comes from the card flip container. We could hide
          // it there, but that would also clip the card during the animation.
          // This is also the reason why we use the full height here.
          isHorizontal ? 'h-full justify-center overflow-hidden' : ''
        }`}
      >
        {!showSignup && isHorizontal && <Logo />}
        <motion.h1 layout="position" className="text-4xl font-bold">
          Project Lighthouse
        </motion.h1>
        <motion.div layout className="min-w-80">
          <ReactCardFlip isFlipped={showSignup}>
            <LoginCard showSignup={() => setShowSignup(true)} />
            <SignupCard showLogin={() => setShowSignup(false)} />
          </ReactCardFlip>
        </motion.div>
      </div>
      <LiveDisplay width={displayWidth} />
    </div>
  );
}
