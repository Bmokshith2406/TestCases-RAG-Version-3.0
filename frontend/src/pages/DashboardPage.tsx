import { useQuery } from "@tanstack/react-query";
import { Activity, Database, Layers3, Waypoints, AlertTriangle, Loader2 } from "lucide-react";

// import { BackendSummaryPanel } from "@/components/dashboard/BackendSummaryPanel";
//import { DashboardHero } from "@/components/dashboard/DashboardHero";
import { JourneyPanel } from "@/components/dashboard/JourneyPanel";
import { EmptyState } from "../components/EmptyState";
// import { RoleMatrix } from "../components/RoleMatrix";
import { StatCard } from "../components/StatCard";
import { formatNumber, formatPercent } from "../lib/format";
import { api } from "../lib/api";
import { useAuth } from "../lib/auth";

export function DashboardPage() {
  const { user } = useAuth();
  
  const healthQuery = useQuery({
    queryKey: ["health", "deep"],
    queryFn: api.getHealthDeep,
    refetchInterval: 30_000,
  });
  
  const statsQuery = useQuery({
    queryKey: ["stats"],
    queryFn: api.getStats,
    enabled: Boolean(user),
    refetchInterval: 20_000,
  });

  const llm = healthQuery.data?.components?.llm;
  const embedding = healthQuery.data?.components?.embedding_model;
  const stats = statsQuery.data;

  // Determine global loading state for smooth skeleton/spinner transitions
  const isInitializing = statsQuery.isLoading || healthQuery.isLoading;

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto p-6 space-y-8">
      
      {/* 1. Health Alert Banner - Moved to top for immediate visibility */}
      {healthQuery.isError && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg shadow-sm">
          <AlertTriangle size={20} className="text-red-600 flex-shrink-0" />
          <div className="flex flex-col">
            <strong className="text-sm font-semibold">Health diagnostics unavailable</strong>
            <span className="text-sm opacity-90">
              The deep health endpoint is not responding. Connectivity and operations data may be stale.
            </span>
          </div>
        </div>
      )}

      {/* 2. Hero Section */}
      {/* <DashboardHero
        llmProvider={llm?.provider}
        llmModel={llm?.model_name}
        embeddingPreset={embedding?.preset}
        embeddingModel={embedding?.model_name}
        embeddingDimensions={embedding?.dimensions}
      /> */}

      {/* 3. Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        
        <div className="h-full">
          <StatCard
            label="Total Test Cases"
            value={
              isInitializing
                ? "..."
                : formatNumber(stats?.total_test_cases ?? 0)
            }
            detail="Stored semantic assets available for search and curation."
            accent="amber"
            icon={<Layers3 size={18} />}
            className="h-full"
          />
        </div>

        <div className="h-full">
          <StatCard
            label="Linked Scripts"
            value={
              isInitializing
                ? "..."
                : formatNumber(stats?.total_scripts ?? 0)
            }
            detail="Automation artifacts already connected to searchable cases."
            accent="teal"
            icon={<Database size={18} />}
            className="h-full"
          />
        </div>

        <div className="h-full">
          <StatCard
            label="Cache Hit Rate"
            value={
              isInitializing
                ? "..."
                : formatPercent(stats?.cache?.hit_rate ?? 0)
            }
            detail="Search cache effectiveness across recent requests."
            accent="blue"
            icon={<Waypoints size={18} />}
            className="h-full"
          />
        </div>

        <div className="h-full">
          <StatCard
            label="Error Rate"
            value={
              isInitializing
                ? "..."
                : formatPercent(
                    healthQuery.data?.metrics?.error_rate ?? 0
                  )
            }
            detail="Process-wide health ratio from the deep diagnostics endpoint."
            accent="rose"
            icon={<Activity size={18} />}
            className="h-full"
          />
        </div>

      </div>

      {/* 4. Panels Stack */}
      <div className="flex flex-col gap-6">
        
        {/* Backend Summary */}
        {/* 
        <div>
          <BackendSummaryPanel
            health={healthQuery.data}
            isLoading={healthQuery.isLoading}
          />
        </div>
        */}

        {/* Journey Panel */}
        <div className="w-full">
          <JourneyPanel />
        </div>

      </div>

      {/* 5. Role Matrix & Empty States */}
      {/* {!healthQuery.data && !healthQuery.isLoading && !healthQuery.isError ? (
        <EmptyState
          title="Awaiting System Initialization"
          description="Waiting for the backend components to report their status."
        />
      ) : (
        <RoleMatrix />
      )} */}
      
    </div>
  );
}