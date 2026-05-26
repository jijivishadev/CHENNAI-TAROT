"use client";

import { AnimatePresence, motion } from "framer-motion";

type FaqItemProps = {
  id: string;
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: (id: string) => void;
};

export default function FaqItem({ id, question, answer, isOpen, onToggle }: FaqItemProps) {
  return (
    <div
      className={`rounded-2xl border-[0.5px] bg-white/5 backdrop-blur-xl transition-all duration-300 ${
        isOpen
          ? "border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.1)]"
          : "border-white/10"
      }`}
    >
      <button
        type="button"
        onClick={() => onToggle(id)}
        className="flex min-h-16 w-full items-center justify-between gap-5 px-6 py-5 text-left"
      >
        <span className="text-lg font-medium leading-relaxed text-[#D4AF37] sm:text-xl">{question}</span>
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ type: "spring", stiffness: 360, damping: 24 }}
          className="shrink-0 text-2xl leading-none text-[#D4AF37]"
          aria-hidden="true"
        >
          +
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0, y: -4 }}
            animate={{ height: "auto", opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, y: -4 }}
            transition={{ type: "spring", stiffness: 280, damping: 30, mass: 0.9 }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-6 text-base leading-8 text-white sm:text-lg">{answer}</p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}