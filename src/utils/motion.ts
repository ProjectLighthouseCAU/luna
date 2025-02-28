import { AnimatePresence as AnimatePresenceFM } from 'framer-motion';
import { ElementType } from 'react';

// Workaround for https://github.com/framer/motion/issues/1509
// See https://github.com/withastro/astro/issues/8195#issuecomment-2613930022
export const AnimatePresence = AnimatePresenceFM as ElementType;
