import { motion, type HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AnimatedCardProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  delay?: number;
  hoverY?: number;
  hoverScale?: number;
  className?: string;
}

export const AnimatedCard = ({
  children,
  delay = 0,
  hoverY = -8,
  hoverScale = 1.02,
  className,
  ...props
}: AnimatedCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
    whileHover={{ y: hoverY, scale: hoverScale }}
    whileTap={{ scale: 0.98 }}
    className={cn("transition-shadow duration-300", className)}
    {...props}
  >
    {children}
  </motion.div>
);

interface AnimatedGlowCardProps extends AnimatedCardProps {
  glowColor?: string;
}

export const AnimatedGlowCard = ({
  children,
  delay = 0,
  hoverY = -8,
  glowColor = "hsl(var(--primary) / 0.3)",
  className,
  ...props
}: AnimatedGlowCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
    whileHover={{
      y: hoverY,
      boxShadow: `0 20px 40px -10px ${glowColor}`,
    }}
    whileTap={{ scale: 0.98 }}
    className={cn("transition-shadow duration-300", className)}
    {...props}
  >
    {children}
  </motion.div>
);

export const AnimatedFeatureCard = ({
  children,
  delay = 0,
  className,
  ...props
}: AnimatedCardProps) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.98 }}
    className={cn(
      "relative overflow-hidden rounded-2xl border border-border bg-card p-6",
      "before:absolute before:inset-0 before:-z-10 before:rounded-2xl before:bg-gradient-to-br before:from-primary/10 before:to-accent/10 before:opacity-0 before:transition-opacity before:duration-300",
      "hover:before:opacity-100",
      className
    )}
    {...props}
  >
    {children}
  </motion.div>
);

// Grid container for animated cards
interface AnimatedGridProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

export const AnimatedGrid = ({
  children,
  className,
  staggerDelay = 0.1,
}: AnimatedGridProps) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-50px" }}
    variants={{
      hidden: {},
      visible: {
        transition: { staggerChildren: staggerDelay },
      },
    }}
    className={className}
  >
    {children}
  </motion.div>
);

export const AnimatedGridItem = ({
  children,
  className,
  hoverY = -6,
}: {
  children: ReactNode;
  className?: string;
  hoverY?: number;
}) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
    }}
    whileHover={{ y: hoverY }}
    whileTap={{ scale: 0.98 }}
    className={className}
  >
    {children}
  </motion.div>
);
