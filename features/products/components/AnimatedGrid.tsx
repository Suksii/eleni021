"use client";

import { Children, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils/cn";

const EASE = [0.2, 0.7, 0.3, 1] as const;

// Stepenasto pojavljivanje kartica pri učitavanju i promeni kategorije
// (`key` na roditelju restartuje animaciju). Server kartice ulaze kao children.
export default function AnimatedGrid({ children, className }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  const items = Children.toArray(children);
  return (
    <motion.div
      className={cn("grid", className)}
      initial={reduced ? false : "hidden"}
      animate="show"
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } } }}
    >
      {items.map((child, i) => (
        <motion.div
          key={(child as { key?: string | number }).key ?? i}
          variants={{
            hidden: { opacity: 0, y: 24, scale: 0.98 },
            show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease: EASE } },
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
