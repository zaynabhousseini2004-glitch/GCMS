"use client";

import { motion, Variants } from "framer-motion";
import { ReactNode } from "react";

// ── Shared variants ──────────────────────────────────────────────
const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0,  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const fadeInVariant: Variants = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { duration: 0.45, ease: "easeOut" } },
};

const slideLeftVariant: Variants = {
  hidden: { opacity: 0, x: -40 },
  show:   { opacity: 1, x: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

const slideRightVariant: Variants = {
  hidden: { opacity: 0, x: 40 },
  show:   { opacity: 1, x: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

const scaleInVariant: Variants = {
  hidden: { opacity: 0, scale: 0.88 },
  show:   { opacity: 1, scale: 1, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

export const staggerContainerVariant: Variants = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.08 } },
};

export const staggerItemVariant: Variants = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

// ── Utility props ───────────────────────────────────────────────
interface MotionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Use whileInView (scroll-triggered) instead of animate on mount */
  inView?: boolean;
}

function getViewProps(inView: boolean) {
  return inView
    ? { whileInView: "show", viewport: { once: true, margin: "-60px" } }
    : { animate: "show" };
}

// ── Exported components ─────────────────────────────────────────

/** Fade up from below — general purpose */
export function FadeUp({ children, className, delay = 0, inView = false }: MotionProps) {
  const viewProps = getViewProps(inView);
  return (
    <motion.div
      className={className}
      variants={fadeUpVariant}
      initial="hidden"
      {...viewProps}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

/** Plain opacity fade */
export function FadeIn({ children, className, delay = 0, inView = false }: MotionProps) {
  const viewProps = getViewProps(inView);
  return (
    <motion.div
      className={className}
      variants={fadeInVariant}
      initial="hidden"
      {...viewProps}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

/** Slide in from the left */
export function SlideInLeft({ children, className, delay = 0, inView = false }: MotionProps) {
  const viewProps = getViewProps(inView);
  return (
    <motion.div
      className={className}
      variants={slideLeftVariant}
      initial="hidden"
      {...viewProps}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

/** Slide in from the right */
export function SlideInRight({ children, className, delay = 0, inView = false }: MotionProps) {
  const viewProps = getViewProps(inView);
  return (
    <motion.div
      className={className}
      variants={slideRightVariant}
      initial="hidden"
      {...viewProps}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

/** Scale + fade — great for cards, icons */
export function ScaleIn({ children, className, delay = 0, inView = false }: MotionProps) {
  const viewProps = getViewProps(inView);
  return (
    <motion.div
      className={className}
      variants={scaleInVariant}
      initial="hidden"
      {...viewProps}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

/** Full page wrapper — fades in on route change */
export function PageWrapper({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

/** Stagger container — wraps a list of StaggerItem */
export function StaggerContainer({ children, className, inView = false }: { children: ReactNode; className?: string; inView?: boolean }) {
  const viewProps = getViewProps(inView);
  return (
    <motion.div
      className={className}
      variants={staggerContainerVariant}
      initial="hidden"
      {...viewProps}
    >
      {children}
    </motion.div>
  );
}

/** Stagger item — must be inside StaggerContainer */
export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div className={className} variants={staggerItemVariant}>
      {children}
    </motion.div>
  );
}

/** Slide down from top — for headers/navbars */
export function SlideDown({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
