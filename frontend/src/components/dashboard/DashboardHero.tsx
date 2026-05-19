import { Link } from "react-router-dom";
import { Cpu, Database, ArrowRight, Settings, Sparkles } from "lucide-react";

type DashboardHeroProps = {
  llmProvider?: string;
  llmModel?: string;
  embeddingPreset?: string;
  embeddingModel?: string;
  embeddingDimensions?: number;
};

type SignalCardProps = {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
  isActive?: boolean;
};

// 1. Extracted SignalCard for reusability and cleaner main component
function SignalCard({ title, value, description, icon: Icon, isActive = false }: SignalCardProps) {
  return (
    <div 
      className={`flex items-start gap-4 p-5 rounded-xl border transition-all duration-200 ${
        isActive 
          ? "border-blue-500/30 bg-blue-50/50 shadow-sm" 
          : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
      }`}
    >
      <div className={`p-2.5 rounded-lg ${isActive ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"}`}>
        <Icon size={20} strokeWidth={2} />
      </div>
      <div className="flex flex-col">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
          {title}
        </span>
        <strong className="text-lg font-bold text-gray-900 leading-tight">
          {value}
        </strong>
        <span className="text-sm text-gray-600 mt-1 line-clamp-1">
          {description}
        </span>
      </div>
    </div>
  );
}

export function DashboardHero({
  llmProvider,
  llmModel,
  embeddingPreset,
  embeddingModel,
  embeddingDimensions,
}: DashboardHeroProps) {
  
  // 2. Computed states for cleaner JSX rendering
  const isLlmActive = Boolean(llmProvider && llmModel);
  const isEmbeddingActive = Boolean(embeddingModel);

  return (
    <section className="relative w-full max-w-6xl mx-auto py-12 px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      
      {/* Left Column: Hero Copy */}
      <div className="flex flex-col items-start max-w-2xl">
        <div className="flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-medium">
          <Sparkles size={16} />
          <span>Command View</span>
        </div>
        
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight leading-[1.15] mb-6">
          One frontend for search, ingestion, and operability.
        </h1>
        
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          This workspace mirrors your upgraded inference backend: JWT auth, scoped RBAC, background jobs, vector search, LLM reranking, pluggable providers, and enterprise health surfaces.
        </p>
        
        <div className="flex flex-wrap items-center gap-4">
          <Link 
            to="/search"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 text-base font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            Explore Semantic Search
            <ArrowRight size={18} />
          </Link>
          <Link 
            to="/operations"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
          >
            <Settings size={18} />
            Open Operations
          </Link>
        </div>
      </div>

      {/* Right Column: Telemetry Stack */}
      <div className="flex flex-col gap-4 w-full">
        <SignalCard
          title="LLM Backend"
          value={llmProvider || "Not detected"}
          description={llmModel || "Waiting for runtime health data..."}
          icon={Cpu}
          isActive={isLlmActive}
        />
        
        <SignalCard
          title="Embedding Preset"
          value={embeddingPreset || "Custom/Unknown"}
          description={
            embeddingModel 
              ? `${embeddingModel} ${embeddingDimensions ? `• ${embeddingDimensions} dims` : ""}`
              : "No vector model loaded"
          }
          icon={Database}
          isActive={isEmbeddingActive}
        />
      </div>
      
    </section>
  );
}