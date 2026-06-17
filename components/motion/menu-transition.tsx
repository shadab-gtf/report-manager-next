"use client";

import { motion, HTMLMotionProps, AnimatePresence } from "framer-motion";

interface MenuTransitionProps extends HTMLMotionProps<"div"> {
  isOpen: boolean;
  origin?: "top left" | "top right" | "bottom left" | "bottom right" | "top" | "bottom";
}

export function MenuTransition({
  children,
  isOpen,
  origin = "top",
  ...props
}: MenuTransitionProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -5 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -5 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          style={{ transformOrigin: origin }}
          {...props}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
