"use client";

import { motion, HTMLMotionProps } from "framer-motion";

interface ScaleInProps extends HTMLMotionProps<"div"> {
  delay?: number;
  duration?: number;
  initialScale?: number;
}

export function ScaleIn({
  children,
  delay = 0,
  duration = 0.4,
  initialScale = 0.9,
  ...props
}: ScaleInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: initialScale }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: initialScale }}
      transition={{ duration, delay, ease: [0.175, 0.885, 0.32, 1.275] }} // slightly bouncy
      {...props}
    >
      {children}
    </motion.div>
  );
}
