import { motion } from "framer-motion";
import type { ReactNode } from "react";

type StatCardProps = {
  label: string;
  value: string;
  detail?: string;
  accent?: "amber" | "teal" | "slate" | "blue" | "rose";
  icon?: ReactNode;
  className?: string;
};

export function StatCard({
  label,
  value,
  detail,
  accent,
  icon,
  className = "",
}: StatCardProps) {
  return (
    <motion.article
      className={`stat-card h-full ${accent ? `accent-${accent}` : ""} ${className}`.trim()}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="stat-card-content">
        
        <div className="stat-card-head">
          <span>{label}</span>

          {icon ? (
            <div className="stat-icon">
              {icon}
            </div>
          ) : null}
        </div>

        <strong className="stat-value">
          {value}
        </strong>

        {detail ? (
          <p className="stat-detail">
            {detail}
          </p>
        ) : null}
      </div>
    </motion.article>
  );
}