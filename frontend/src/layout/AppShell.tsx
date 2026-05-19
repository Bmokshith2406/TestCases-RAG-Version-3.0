import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronRight,
  Loader2,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { NavLink, Navigate, Outlet, useLocation } from "react-router-dom";

import { navigationItems, resolveRouteTitle } from "@/app/navigation";
import { titleCaseRole } from "../lib/access";
import { useAuth } from "../lib/auth";
import type { Role } from "../lib/types";
import { cn } from "@/lib/utils";

export function AppShell() {
  const { isAuthenticated, isLoading, logout, user, role } = useAuth();
  const location = useLocation();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const visibleNavigation = useMemo(
    () =>
      navigationItems.filter((item) =>
        item.roles.includes((role || "viewer") as Role)
      ),
    [role]
  );

  if (isLoading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-[#F7F3EE] px-4">
        <Loader2
          size={32}
          className="mb-4 animate-spin text-[#4F9FB3]"
          aria-hidden="true"
        />

        <p className="animate-pulse text-center text-sm font-medium tracking-wide text-[#48626B]">
          Reconstructing your workspace…
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#F7F3EE] font-sans text-[#173039] selection:bg-[#A8D5DF]/40">
      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col border-r border-[rgba(255,255,255,0.45)] bg-[linear-gradient(180deg,rgba(255,251,245,0.94)_0%,rgba(242,236,228,0.96)_100%)] p-4 backdrop-blur-xl transition-transform duration-300 ease-in-out",
            
            mobileSidebarOpen ? "translate-x-0" : "-translate-x-full",

            "lg:static lg:z-auto lg:translate-x-0 lg:w-64 xl:w-72"
          )}
        >
        {/* Mobile Close */}
        <div className="mb-4 flex items-center justify-end lg:hidden">
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="rounded-xl p-2 transition hover:bg-white/60"
          >
            <X size={20} />
          </button>
        </div>

        {/* Brand */}
        <div className="mb-6 flex items-center gap-3 px-1 sm:px-2">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#D9D1C7] bg-white/60 shadow-sm backdrop-blur-md">
            <img
              src={`${import.meta.env.BASE_URL}logo-placeholder_full.png`}
              alt="TestCasesRAG Logo"
              className="h-7 w-7 object-contain"
            />
          </div>

          <div className="min-w-0">
            <p className="truncate text-[10px] font-semibold uppercase tracking-widest text-[#4F9FB3]">
              Semantic QA Platform
            </p>

            <h1 className="truncate text-base font-bold tracking-tight text-[#173039]">
              TestCasesRAG
            </h1>
          </div>
        </div>

        {/* Navigation */}
        <nav
          className="custom-scrollbar flex flex-1 flex-col gap-1 overflow-y-auto"
          aria-label="Primary Workspace Navigation"
        >
          {visibleNavigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                onClick={() => setMobileSidebarOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "group flex items-center justify-between rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[#4F9FB3]/30",
                    isActive
                      ? "border border-[#B9D7DF] bg-[#DFF1F5] text-[#226273] shadow-sm"
                      : "text-[#5F747B] hover:bg-white/60 hover:text-[#173039]"
                  )
                }
              >
                <span className="flex min-w-0 items-center gap-3">
                  <Icon size={18} className="shrink-0" aria-hidden="true" />

                  <span className="truncate">{item.label}</span>
                </span>

                <ChevronRight
                  size={16}
                  className="shrink-0 opacity-0 transition-all duration-200 text-[#4F9FB3] group-hover:-translate-x-1 group-hover:opacity-100"
                  aria-hidden="true"
                />
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="mt-auto pt-4">
          {/* User Card */}
          <div className="mb-4 rounded-2xl border border-white/40 bg-white/60 p-4 shadow-sm backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#DFF1F5]">
                <span className="text-sm font-semibold text-[#226273]">
                  {user?.username?.charAt(0).toUpperCase()}
                </span>

                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-400" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-[#173039]">
                  {user?.username}
                </p>

                <p className="truncate text-[10px] font-medium uppercase tracking-wider text-[#5F747B]">
                  {titleCaseRole(role)}
                </p>
              </div>
            </div>
          </div>

          {/* Logout */}
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-[#5F747B] transition-colors duration-200 hover:bg-white/60 hover:text-[#173039] outline-none focus-visible:ring-2 focus-visible:ring-[#4F9FB3]/30"
          >
            <LogOut size={16} aria-hidden="true" />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      {/* Main Layout */}
      <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="z-10 flex h-16 shrink-0 items-center justify-between border-b border-[rgba(255,255,255,0.52)] bg-[rgba(255,251,245,0.74)] px-4 backdrop-blur-md sm:h-20 sm:px-6 lg:px-8">
          {/* Mobile Menu */}
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="rounded-xl p-2 transition hover:bg-white/60 lg:hidden"
          >
            <Menu size={22} />
          </button>

          <div className="ml-auto flex flex-col items-end justify-center text-right">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[#4F9FB3] sm:text-xs">
              Workspace
            </p>

            <h2 className="max-w-[220px] truncate text-base font-semibold tracking-tight text-[#173039] sm:max-w-none sm:text-xl">
              {resolveRouteTitle(location.pathname)}
            </h2>
          </div>
        </header>

        {/* Content */}
        <div className="custom-scrollbar relative flex-1 overflow-y-auto overflow-x-hidden bg-[#F7F3EE]">
          <AnimatePresence mode="wait">
            <motion.main
              key={location.pathname}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{
                duration: 0.3,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="min-h-full w-full text-[#173039]"
            >
              <Outlet />
            </motion.main>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}