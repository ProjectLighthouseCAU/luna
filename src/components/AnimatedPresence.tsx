import { AnimatePresence } from '@luna/utils/motion';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

export interface AnimatedPresenceProps {
  isShown: boolean;
  children: ReactNode;
}

export function AnimatedPresence({ isShown, children }: AnimatedPresenceProps) {
  return (
    <AnimatePresence initial={isShown}>
      {isShown ? (
        <motion.div
          initial="collapsed"
          animate="open"
          exit="collapsed"
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
