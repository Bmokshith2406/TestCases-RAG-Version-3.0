import { motion } from "framer-motion";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export function AuthCard({ children, className = "" }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`
        relative overflow-hidden
        rounded-3xl
        border border-white/10
        bg-white/[0.04]
        backdrop-blur-2xl
        shadow-[0_10px_60px_rgba(0,0,0,0.45)]
        before:absolute before:inset-0
        before:bg-[linear-gradient(to_bottom_right,rgba(255,255,255,0.08),transparent,transparent)]
        before:pointer-events-none
        ${className}
      `}
    >
      {/* Ambient Glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-0 h-56 w-56 rounded-full bg-violet-500/12 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-56 w-56 rounded-full bg-cyan-500/12 blur-3xl" />
      </div>

      {/* Border Highlight */}
      <div className="absolute inset-[1px] rounded-3xl border border-white/5" />

      {/* Noise Texture */}
      <div
        className="absolute inset-0 opacity-[0.03] mix-blend-soft-light"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140' viewBox='0 0 140 140'%3E%3Cg fill='white' fill-opacity='1'%3E%3Ccircle cx='12' cy='12' r='1'/%3E%3Ccircle cx='48' cy='62' r='1'/%3E%3Ccircle cx='102' cy='34' r='1'/%3E%3Ccircle cx='88' cy='118' r='1'/%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />

      {/* Content */}
      <div className="relative z-10 p-8 sm:p-10">
        {children}
      </div>
    </motion.div>
  );
}