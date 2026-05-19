import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, FileCode2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type CodeBlockProps = {
  code: string;
  title?: string;
  language?: string;
  className?: string;
};

export function CodeBlock({
  code,
  title = "Playwright Script",
  language = "typescript",
  className,
}: CodeBlockProps) {
  const [hasCopied, setHasCopied] = useState(false);

  // Safely handle the timeout cleanup to prevent memory leaks if unmounted
  useEffect(() => {
    if (!hasCopied) return;
    const timeout = window.setTimeout(() => setHasCopied(false), 2000);
    return () => window.clearTimeout(timeout);
  }, [hasCopied]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setHasCopied(true);
    } catch (err) {
      console.error("Failed to copy code to clipboard", err);
    }
  }, [code]);

  return (
    <div
      className={cn(
        "relative flex w-full flex-col overflow-hidden rounded-xl border border-white/10 bg-[#0a0a0a] shadow-xl",
        className
      )}
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.02] px-4 py-2.5 backdrop-blur-md">
        <div className="flex items-center gap-2 text-white/60">
          <FileCode2 size={16} aria-hidden="true" />
          <span className="font-mono text-xs font-medium tracking-wide">
            {title}
          </span>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          disabled={hasCopied}
          aria-label={hasCopied ? "Copied to clipboard" : "Copy code"}
          className={cn(
            "group relative flex h-7 items-center justify-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2.5 text-xs font-medium text-white/70",
            "transition-all duration-200 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50",
            "disabled:cursor-not-allowed",
            hasCopied && "border-green-500/20 bg-green-500/10 text-green-400 hover:bg-green-500/10 hover:text-green-400"
          )}
        >
          <AnimatePresence mode="wait" initial={false}>
            {hasCopied ? (
              <motion.div
                key="check"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.15 }}
              >
                <Check size={14} aria-hidden="true" />
              </motion.div>
            ) : (
              <motion.div
                key="copy"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.15 }}
              >
                <Copy size={14} className="transition-transform group-hover:scale-110" aria-hidden="true" />
              </motion.div>
            )}
          </AnimatePresence>
          {/* Fixed width prevents layout shift when text changes */}
          <span className="w-10 text-left">{hasCopied ? "Copied" : "Copy"}</span>
        </button>
      </div>

      {/* Code Area */}
      <div className="relative w-full overflow-x-auto p-4 custom-scrollbar">
        <pre className="text-sm leading-relaxed text-white/80">
          <code className={cn("font-mono", `language-${language}`)}>
            {code || "// No script available."}
          </code>
        </pre>
      </div>
    </div>
  );
}