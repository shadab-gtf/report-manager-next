"use client";

import { motion, HTMLMotionProps } from "framer-motion";

interface HoverCardProps extends HTMLMotionProps<"div"> {
  liftAmount?: number;
}

export function HoverCard({ children, liftAmount = 4, ...props }: HoverCardProps) {
  return (
    <motion.div
      whileHover={{ 
        y: -liftAmount, 
        transition: { duration: 0.2, ease: "easeOut" } 
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
