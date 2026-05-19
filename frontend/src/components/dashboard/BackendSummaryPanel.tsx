import { Panel, PanelHeader } from "@/components/Panel";
import type { HealthDeepResponse } from "@/lib/types";
import { CheckCircle2, AlertTriangle, XCircle, Server } from "lucide-react";

type Props = {
  health?: HealthDeepResponse;
  isLoading?: boolean;
};

// 1. Status Configuration Mapping
const getStatusConfig = (status?: string) => {
  const normalizedStatus = status?.toLowerCase() || "unknown";
  
  switch (normalizedStatus) {
    case "healthy":
    case "online":
    case "ok":
      return { 
        style: "bg-green-50 text-green-700 border-green-200", 
        icon: CheckCircle2 
      };
    case "degraded":
    case "warning":
      return { 
        style: "bg-amber-50 text-amber-700 border-amber-200", 
        icon: AlertTriangle 
      };
    case "offline":
    case "error":
    case "critical":
      return { 
        style: "bg-red-50 text-red-700 border-red-200", 
        icon: XCircle 
      };
    default:
      return { 
        style: "bg-gray-50 text-gray-700 border-gray-200", 
        icon: Server 
      };
  }
};

// 2. Intelligent Key Formatting
const formatKey = (key: string) => {
  if (key.toLowerCase() === "llm") return "LLM";
  if (key.toLowerCase() === "db") return "Database";
  if (key.toLowerCase() === "api") return "API";
  
  return key
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export function BackendSummaryPanel({ health, isLoading }: Props) {
  const components = Object.entries(health?.components || {});

  return (
    <Panel className="h-full flex flex-col">
      <PanelHeader 
        eyebrow="Runtime" 
        title="Backend Surface Summary" 
        description="A living readout of the exact backend services the new frontend is orchestrating." 
      />
      
      <div className="p-4 sm:p-6 flex-grow">
        {/* Loading State: Skeletons */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse border border-gray-200" />
            ))}
          </div>
        ) : components.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center h-40 text-gray-500 border-2 border-dashed border-gray-200 rounded-xl">
            <Server size={32} className="mb-2 text-gray-400" />
            <p>No backend components detected.</p>
          </div>
        ) : (
          /* Loaded Data Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {components.map(([key, component]) => {
              const { style, icon: StatusIcon } = getStatusConfig(component.status);
              
              return (
                <article 
                  key={key} 
                  className="flex flex-col justify-between p-4 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow hover:border-gray-300 transition-all"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {formatKey(key)}
                    </h3>
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium uppercase tracking-wider ${style}`}>
                      <StatusIcon size={14} strokeWidth={2.5} />
                      {component.status || "Unknown"}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {component.model_name ||
                     component.provider ||
                     (component.details 
                       ? "Expanded diagnostics available on the operations page." 
                       : "No extra metadata exposed.")}
                  </p>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </Panel>
  );
}