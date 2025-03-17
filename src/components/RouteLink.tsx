import { Button, PressEvent } from '@heroui/react';
import { IconChevronDown, IconChevronRight } from '@tabler/icons-react';
import {
  MouseEventHandler,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AnimatePresence } from '@luna/utils/motion';
import { ColorSchemeContext } from '@luna/contexts/env/ColorSchemeContext';

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
  const { colorScheme } = useContext(ColorSchemeContext);

  const onPressChevron = useCallback<MouseEventHandler<HTMLDivElement>>(e => {
    setExpanded(isExpanded => !isExpanded);
    e.preventDefault();
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
        {({ isActive }) => (
          <>
            <div className="flex flex-row gap-2">
              {icon}
              {name}
            </div>
            {children ? (
              // Intentionally not using a button for the chevron to avoid
              // https://github.com/ProjectLighthouseCAU/luna/issues/45
              <div
                className={`p-0.5 rounded-md ${isActive || colorScheme.isDark ? 'hover:bg-[rgba(255,255,255,0.2)]' : 'hover:bg-[rgba(128,128,128,0.2)]'} active:opacity-80`}
                onClick={onPressChevron}
              >
                {isExpanded ? <IconChevronDown /> : <IconChevronRight />}
              </div>
            ) : null}
          </>
        )}
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
