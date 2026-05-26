import { motion } from "framer-motion";
import { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export default function Section({ children, className = "", delay = 0 }: SectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: "easeOut", delay }}
      className={className}
    >
      {children}
    </motion.section>
  );
}
