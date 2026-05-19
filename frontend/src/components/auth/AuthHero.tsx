import { motion } from "framer-motion";
import { Activity, DatabaseZap, ShieldCheck, Sparkles } from "lucide-react";
import type { ReactNode } from "react";

export function AuthHero() {
  return (
    <div className="auth-hero">
      <div className="auth-hero-background" />

      <div className="auth-hero-head">
        <img
          src={`${import.meta.env.BASE_URL}logo-placeholder.png`}
          alt="Logo placeholder"
          className="brand-logo large"
        />

        <div>
          <p className="eyebrow">AI Test Intelligence</p>
          <h1>TestCasesRAG</h1>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="auth-hero-copy"
      >
        <h2>Enterprise-grade semantic test intelligence platform.</h2>
        <p>
          Search, retrieve, analyze, and manage automation assets through an AI-native operational workspace designed for
          modern QA teams.
        </p>
      </motion.div>

      <div className="auth-feature-grid">
        <FeatureCard
          icon={<DatabaseZap size={18} />}
          title="Semantic Retrieval"
          description="Vector-powered intelligent search across automation assets."
        />
        <FeatureCard
          icon={<ShieldCheck size={18} />}
          title="RBAC Security"
          description="Granular access control with secure JWT session flows."
        />
        <FeatureCard
          icon={<Activity size={18} />}
          title="Operational Metrics"
          description="Real-time observability and ingestion visibility."
        />
        <FeatureCard
          icon={<Sparkles size={18} />}
          title="AI Native"
          description="Built for intelligent QA and automation workflows."
        />
      </div>
    </div>
  );
}

type FeatureCardProps = {
  icon: ReactNode;
  title: string;
  description: string;
};

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="auth-feature-card">
      <div className="auth-feature-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}
