import { Bot, Search, Shield, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

import { Panel, PanelHeader } from "@/components/Panel";

// 1. Centralized Route Configuration
const JOURNEYS = [
  {
    to: "/search",
    icon: Search,
    title: "Find a test case by intent",
    description: "Run semantic retrieval, inspect confidence, and open linked scripts.",
    iconStyle: "bg-blue-100 text-blue-600",
    hoverStyle: "hover:border-blue-300 hover:ring-1 hover:ring-blue-100",
  },
  {
    to: "/library",
    icon: Shield,
    title: "Curate the library",
    description: "Review stored cases, refine metadata, and keep the corpus healthy.",
    iconStyle: "bg-indigo-100 text-indigo-600",
    hoverStyle: "hover:border-indigo-300 hover:ring-1 hover:ring-indigo-100",
  },
  {
    to: "/upload",
    icon: Bot,
    title: "Push new uploads",
    description: "Use sync or background ingestion with progress visibility built in.",
    iconStyle: "bg-purple-100 text-purple-600",
    hoverStyle: "hover:border-purple-300 hover:ring-1 hover:ring-purple-100",
  },
];

export function JourneyPanel() {
  return (
    <Panel className="h-full flex flex-col">
      <PanelHeader
        // eyebrow="High Value Journeys"
        title="Quick Paths"
        // description="The UI is grouped around the core testing workflows you orchestrate in the backend."
      />
      
      <div className="p-4 sm:p-6 flex-grow flex flex-col gap-3 sm:gap-4">
        {JOURNEYS.map((journey) => {
          const Icon = journey.icon;
          
          return (
            <Link
              key={journey.to}
              to={journey.to}
              className={`group relative flex items-start sm:items-center gap-4 p-4 rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-200 ${journey.hoverStyle}`}
            >
              {/* Distinctive Icon Badge */}
              <div className={`flex-shrink-0 p-3 rounded-lg ${journey.iconStyle}`}>
                <Icon size={22} strokeWidth={2} />
              </div>
              
              {/* Copy */}
              <div className="flex-col flex-grow pr-6">
                <strong className="block text-base font-semibold text-gray-900 mb-0.5 group-hover:text-gray-900 transition-colors">
                  {journey.title}
                </strong>
                <span className="block text-sm text-gray-600 leading-snug">
                  {journey.description}
                </span>
              </div>
              
              {/* Interactive Affordance */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200">
                <ChevronRight size={20} />
              </div>
            </Link>
          );
        })}
      </div>
    </Panel>
  );
}