import { motion, useScroll } from "motion/react";

import { cn } from "@/lib/utils";

interface ScrollProgressProps {
  className?: string;
}

export function ScrollProgress({ className }: ScrollProgressProps) {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      className={cn(
        "fixed inset-x-0 top-0 z-100 h-px origin-left bg-linear-to-r from-primary-600 via-primary-200 to-primary-700",
        className
      )}
      style={{
        scaleX: scrollYProgress,
      }}
    />
  );
}
