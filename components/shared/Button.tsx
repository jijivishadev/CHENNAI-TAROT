import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  active?: boolean;
  showArrow?: boolean;
  compact?: boolean;
  "aria-label"?: string;
}

export default function Button({
  children,
  className = "",
  active = false,
  showArrow = true,
  compact = false,
  ...props
}: ButtonProps) {
  const base = compact
    ? "group rounded-full font-bold bg-[#D4AF37] text-[#4B2E83] border border-[#D4AF37] px-4 py-2 flex items-center gap-2 shadow hover:bg-[#4B2E83] hover:text-[#D4AF37] transition-all duration-300 cursor-pointer uppercase tracking-wide"
    : "group rounded-full font-bold bg-[#D4AF37] text-[#4B2E83] border border-[#D4AF37] px-8 py-3.5 flex items-center gap-3.5 shadow hover:bg-[#4B2E83] hover:text-[#D4AF37] transition-all duration-300 cursor-pointer uppercase tracking-wide";
  const activeClass = active ? "bg-[#4B2E83] text-[#D4AF37]" : "";
  return (
    <button
      {...props}
      className={`${base} ${activeClass} ${className}`.trim()}
    >
      <span className={compact ? "font-semibold text-[0.95rem] leading-none" : "font-semibold text-lg"}>{children}</span>
      {showArrow && (
        <span className={`ml-2 inline-flex items-center justify-center rounded-full bg-[#4B2E83] transition-colors duration-300 group-hover:bg-[#D4AF37] ${compact ? "h-8 w-8" : "h-9 w-9"}`}>
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className={`${compact ? "h-4 w-4" : "h-4.5 w-4.5"} text-[#D4AF37] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-[2px] group-hover:translate-x-[2px] group-hover:-rotate-[18deg] group-hover:text-[#4B2E83]`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </span>
      )}
    </button>
  );
}
