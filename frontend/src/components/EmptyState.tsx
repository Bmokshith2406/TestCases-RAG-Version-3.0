import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({ title, description, action, className }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "flex w-full flex-col items-center justify-center rounded-2xl border border-dashed border-white/10",
        "bg-white/[0.02] px-6 py-16 text-center backdrop-blur-sm",
        className
      )}
    >
      {/* Ambient Depth Orb */}
      <div className="relative mb-6 flex h-20 w-20 items-center justify-center" aria-hidden="true">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.8, ease: "easeOut" }}
          className="absolute inset-0 rounded-full bg-violet-500/20 blur-2xl"
        />
        <div className="relative flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 shadow-inner backdrop-blur-md">
          <div className="h-5 w-5 rounded-full border border-white/20 bg-white/10 shadow-[0_0_15px_rgba(139,92,246,0.3)]" />
        </div>
      </div>

      <h3 className="mb-2 text-lg font-semibold tracking-tight text-white">
        {title}
      </h3>
      
      <p className="mb-8 max-w-sm text-sm leading-relaxed text-white/50">
        {description}
      </p>

      {action && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4, ease: "easeOut" }}
        >
          {action}
        </motion.div>
      )}
    </motion.div>
  );
}