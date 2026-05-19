import { motion } from "framer-motion";
import { ArrowLeft, Map } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export function NotFoundPage() {
  return (
    <div className="flex min-h-[80vh] w-full flex-col items-center justify-center px-6 py-24 text-center selection:bg-violet-500/30">
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex w-full max-w-md flex-col items-center"
      >
        {/* Ambient 404 Visual */}
        <div className="relative mb-8 flex h-24 w-24 items-center justify-center rounded-3xl border border-white/10 bg-white/5 shadow-inner backdrop-blur-md">
          <div className="absolute inset-0 rounded-3xl bg-violet-500/20 blur-2xl" />
          <Map size={36} className="relative z-10 text-violet-400" aria-hidden="true" strokeWidth={1.5} />
        </div>

        {/* Copy */}
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-violet-400">
          Error 404
        </p>
        <h1 className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Outside Platform Map
        </h1>
        <p className="mb-10 text-base leading-relaxed text-white/50">
          The frontend is mounted as a single-page application. This route is unmapped. Please use a known trajectory to return to the control center.
        </p>

        {/* Action */}
        <Link
          to="/"
          className={cn(
            "group relative flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-sm",
            "transition-all duration-200 hover:bg-violet-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-500/30"
          )}
        >
          <ArrowLeft
            size={18}
            className="transition-transform duration-200 group-hover:-translate-x-1"
            aria-hidden="true"
          />
          <span>Return to Overview</span>
        </Link>
      </motion.div>
    </div>
  );
}