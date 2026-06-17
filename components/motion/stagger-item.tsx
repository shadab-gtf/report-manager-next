"use client";

import { motion, HTMLMotionProps, Variants } from "framer-motion";

interface StaggerItemProps extends HTMLMotionProps<"div"> {
  yOffset?: number;
}

export function StaggerItem({ children, yOffset = 20, ...props }: StaggerItemProps) {
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: yOffset },
    show: { opacity: 1, y: 0, transition: { ease: "easeOut", duration: 0.4 } },
  };

  return (
    <motion.div variants={itemVariants} {...props}>
      {children}
    </motion.div>
  );
}
