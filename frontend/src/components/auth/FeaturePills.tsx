import { DatabaseZap, ShieldCheck, Sparkles } from "lucide-react";

const pills = [
  {
    icon: <Sparkles size={16} />,
    label: "AI Retrieval",
  },
  {
    icon: <DatabaseZap size={16} />,
    label: "Vector Search",
  },
  {
    icon: <ShieldCheck size={16} />,
    label: "RBAC Security",
  },
];

export function FeaturePills() {
  return (
    <div className="auth-pill-row">
      {pills.map((pill) => (
        <div key={pill.label} className="auth-pill">
          <span className="auth-pill-icon">{pill.icon}</span>
          <span>{pill.label}</span>
        </div>
      ))}
    </div>
  );
}
