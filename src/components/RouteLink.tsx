import { Button } from '@heroui/react';
import { IconChevronDown, IconChevronRight } from '@tabler/icons-react';
import { ElementType, ReactNode, useCallback, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { AnimatePresence as AnimatePresenceFM, motion } from 'framer-motion';

// Workaround for https://github.com/framer/motion/issues/1509
// See https://github.com/withastro/astro/issues/8195#issuecomment-2613930022
const AnimatePresence = AnimatePresenceFM as ElementType;

interface RouteLinkParams {
  icon: ReactNode;
  name: string;
  path: string;
  isSkeleton?: boolean;
  children?: ReactNode;
}

export function RouteLink({
  icon,
  name,
  path,
  isSkeleton = false,
  children,
}: RouteLinkParams) {
  const [isExpanded, setExpanded] = useState(true);

  const toggleExpanded = useCallback(() => {
    setExpanded(isExpanded => !isExpanded);
  }, []);

  return isSkeleton ? (
    <div className="h-10" />
  ) : (
    <div className={`flex flex-col space-y-1h-10`}>
      <NavLink
        to={path}
        end
        className={({ isActive }) =>
          `${
            isActive ? 'bg-primary text-white' : ''
          } px-2 py-1.5 rounded flex flex-row items-center justify-between h-10`
        }
      >
        <div className="flex flex-row gap-2">
          {icon}
          {name}
        </div>
        {children ? (
          <Button
            isIconOnly
            onPress={toggleExpanded}
            variant="light"
            size="sm"
            className="text-inherit"
          >
            {isExpanded ? <IconChevronDown /> : <IconChevronRight />}
          </Button>
        ) : null}
      </NavLink>
      <AnimatePresence initial={isExpanded}>
        {isExpanded ? (
          <motion.div
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: 'auto' },
              collapsed: { opacity: 0, height: 0 },
            }}
            transition={{ duration: 0.2 }}
            className="ml-4"
          >
            {children}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
