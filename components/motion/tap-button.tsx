"use client";

import { motion, HTMLMotionProps } from "framer-motion";

interface TapButtonProps extends HTMLMotionProps<"div"> {
  scaleDown?: number;
}

export function TapButton({ children, scaleDown = 0.95, ...props }: TapButtonProps) {
  return (
    <motion.div
      whileTap={{ scale: scaleDown }}
      transition={{ duration: 0.1 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
