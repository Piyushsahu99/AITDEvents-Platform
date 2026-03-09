import { motion, type HTMLMotionProps, type Variants } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedSectionProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  delay?: number;
  className?: string;
}

const fadeInVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] },
  }),
};

export const AnimatedSection = ({
  children,
  delay = 0,
  className,
  ...props
}: AnimatedSectionProps) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-50px" }}
    custom={delay}
    variants={fadeInVariants}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
);

const slideLeftVariants: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: (delay: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] },
  }),
};

export const AnimatedSlideLeft = ({
  children,
  delay = 0,
  className,
  ...props
}: AnimatedSectionProps) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-50px" }}
    custom={delay}
    variants={slideLeftVariants}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
);

const slideRightVariants: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: (delay: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] },
  }),
};

export const AnimatedSlideRight = ({
  children,
  delay = 0,
  className,
  ...props
}: AnimatedSectionProps) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-50px" }}
    custom={delay}
    variants={slideRightVariants}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
);

const scaleVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (delay: number) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] },
  }),
};

export const AnimatedScale = ({
  children,
  delay = 0,
  className,
  ...props
}: AnimatedSectionProps) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-50px" }}
    custom={delay}
    variants={scaleVariants}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
);

// Stagger container
interface AnimatedStaggerProps {
  children: ReactNode;
  staggerDelay?: number;
  className?: string;
}

const staggerContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const AnimatedStagger = ({
  children,
  staggerDelay = 0.1,
  className,
}: AnimatedStaggerProps) => (
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

const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

export const AnimatedStaggerItem = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <motion.div variants={staggerItemVariants} className={className}>
    {children}
  </motion.div>
);
