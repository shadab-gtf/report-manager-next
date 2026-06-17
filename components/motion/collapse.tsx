"use client";

import { motion, AnimatePresence, HTMLMotionProps } from "framer-motion";

interface CollapseProps extends HTMLMotionProps<"div"> {
  isOpen: boolean;
}

export function Collapse({ children, isOpen, ...props }: CollapseProps) {
  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          style={{ overflow: "hidden" }}
          {...props}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
