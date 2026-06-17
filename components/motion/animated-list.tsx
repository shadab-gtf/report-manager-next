"use client";

import { motion, AnimatePresence, HTMLMotionProps } from "framer-motion";
import React from "react";

interface AnimatedListProps extends HTMLMotionProps<"ul"> {
  children: React.ReactNode;
}

export function AnimatedList({ children, ...props }: AnimatedListProps) {
  return (
    <motion.ul {...props}>
      <AnimatePresence initial={false}>
        {React.Children.map(children, (child) => {
          if (!React.isValidElement(child)) return child;
          
          return (
            <motion.li
              key={child.key}
              initial={{ opacity: 0, height: 0, scale: 0.95 }}
              animate={{ opacity: 1, height: "auto", scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.95 }}
              transition={{ duration: 0.3, type: "spring", bounce: 0.2 }}
            >
              {child}
            </motion.li>
          );
        })}
      </AnimatePresence>
    </motion.ul>
  );
}
