import { ReactNode } from "react";

interface GradientCardProps {
  children: ReactNode;
  className?: string;
}

export default function GradientCard({ children, className = "" }: GradientCardProps) {
  return (
    <div
      className={`relative rounded-2xl overflow-hidden shadow-xl border border-[#D4AF37]/20 bg-gradient-to-br from-[#FDFBFF] via-[#F3ECFF]/60 to-white hover:shadow-2xl transition-shadow duration-300 ${className}`}
    >
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#D4AF37]/10 via-transparent to-transparent z-0" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
