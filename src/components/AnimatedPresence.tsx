import { AnimatePresence } from '@luna/utils/motion';
import { motion } from 'framer-motion';
import { ReactNode, useCallback, useState } from 'react';

export interface AnimatedPresenceProps {
  isShown: boolean;
  hideScrollbars?: boolean;
  children: ReactNode;
}

export function AnimatedPresence({
  isShown,
  hideScrollbars = false,
  children,
}: AnimatedPresenceProps) {
  const [isAnimating, setAnimating] = useState(false);

  const onAnimationStart = useCallback(() => setAnimating(true), []);
  const onAnimationEnd = useCallback(() => setAnimating(false), []);

  return (
    <AnimatePresence initial={false}>
      {isShown ? (
        <motion.div
          initial="collapsed"
          animate="open"
          exit="collapsed"
          onAnimationStart={onAnimationStart}
          onAnimationEnd={onAnimationEnd}
          className={isAnimating || hideScrollbars ? 'overflow-hidden' : ''}
          variants={{
            open: { opacity: 1, height: 'auto' },
            collapsed: { opacity: 0, height: 0 },
          }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.div>
      ) : undefined}
    </AnimatePresence>
  );
}
