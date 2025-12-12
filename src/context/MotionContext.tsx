'use client';

import { motion, AnimatePresence } from 'framer-motion';

const variants = {
    hidden: { opacity: 0, x: 0, y: 20 },
    enter: { opacity: 1, x: 0, y: 0 },
    exit: { opacity: 0, x: 0, y: -20 },
};

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <AnimatePresence
        mode="wait"
        initial={false}
        onExitComplete={() => window.scrollTo(0, 0)}
    >
        <motion.div
            initial="hidden"
            animate="enter"
            exit="exit"
            variants={variants}
            transition={{ type: 'linear' }}
        >
            {children}
        </motion.div>
    </AnimatePresence>
  );
}
