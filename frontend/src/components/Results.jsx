import { useState } from "react";
import { Badge } from "../components/ui/badge";
import {
  Collapsible, CollapsibleContent, CollapsibleTrigger,
} from "../components/ui/collapsible";
import { ChevronDown, ShieldAlert, ShieldCheck, Activity } from "lucide-react";

const riskColor = (score) => {
  if (score >= 75) return "from-red-500 to-orange-500";
  if (score >= 50) return "from-orange-400 to-yellow-400";
  if (score >= 25) return "from-yellow-400 to-cyan-400";
  return "from-cyan-400 to-emerald-400";
};

const riskLabel = (score) => {
  if (score >= 75) return "CRITICAL";
  if (score >= 50) return "HIGH";
  if (score >= 25) return "MODERATE";
  return "LOW";
};

export const Results = ({ data }) => {
  const [rawOpen, setRawOpen] = useState(false);

  const score = Math.round(data?.risk_score ?? data?.risk?.score ?? data?.score ?? 0);
  const coordination = data?.coordination_detected ?? data?.coordination?.detected ?? data?.is_coordinated ?? false;
  const similarity = data?.similarity_score ?? data?.coordination?.similarity ?? data?.avg_similarity ?? null;
  const reasoning = data?.reasoning ?? data?.llm_analysis ?? data?.analysis ?? null;
  const similar = data?.similar_posts ?? data?.matches ?? data?.similar ?? [];

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.03] to-transparent p-8">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <div className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-white/50">
              <Activity className="h-3 w-3" />
              Risk Engine Output
            </div>
            <div className="flex items-baseline gap-3">
              <span className={`bg-gradient-to-br ${riskColor(score)} bg-clip-text text-7xl font-black leading-none text-transparent`}>
                {score}
                </span>
              <span className="text-2xl font-light text-white/40">/ 100</span>
            </div>
            <Badge className={`mt-4 border-0 bg-gradient-to-r ${riskColor(score)} px-3 py-1 font-mono text-[10px] tracking-widest text-black`}>
              {riskLabel(score)} RISK
            </Badge>
          </div>

          <div className={`flex items-center gap-3 rounded-2xl border px-5 py-4 ${
            coordination
              ? "border-red-400/30 bg-red-500/10 text-red-300"
              : "border-emerald-400/30 bg-emerald-500/10 text-emerald-300"
          }`}>
            {coordination ? <ShieldAlert className="h-6 w-6" /> : <ShieldCheck className="h-6 w-6" />}
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest opacity-70">Coordination</div>
              <div className="text-sm font-semibold">
                {coordination ? "Detected" : "Not Detected"}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${riskColor(score)} transition-all duration-1000`}
            style={{ width: `${score}%` }}
          />
        </div>
        {similarity !== null && (
          <div className="mt-6 grid grid-cols-2 gap-6 border-t border-white/5 pt-6 sm:grid-cols-3">
            <Metric label="Avg Similarity" value={`${Math.round(similarity * 100) || 0}%`} />
            <Metric label="Posts Analyzed" value={similar.length || "—"} />
            <Metric label="Detection Status" value={coordination ? "Flagged" : "Clear"} />
          </div>
        )}
      </div>

      {reasoning && (
        <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6">
          <div className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-cyan-300/70">LLM Analysis</div>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-white/80">
            {typeof reasoning === "string" ? reasoning : JSON.stringify(reasoning, null, 2)}
          </p>
        </div>
      )}
      {Array.isArray(similar) && similar.length > 0 && (
        <div>
          <div className="mb-4 flex items-baseline justify-between">
            <h3 className="text-lg font-semibold text-white">
              Similar Posts <span className="text-white/40">({similar.length})</span>
            </h3>
            <span className="font-mono text-[10px] uppercase tracking-widest text-white/40">
              Vector Search Results
            </span>
          </div>
          <div className="space-y-3">
            {similar.map((p, i) => <SimilarPostCard key={i} post={p} />)}
          </div>
        </div>
      )}
      <Collapsible open={rawOpen} onOpenChange={setRawOpen}>
        <CollapsibleTrigger className="group flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] px-5 py-3 text-left text-sm text-white/60 transition-colors hover:border-cyan-400/20 hover:text-white">
          <span className="font-mono text-xs uppercase tracking-widest"></span>
          <ChevronDown className={`h-4 w-4 transition-transform ${rawOpen ? "rotate-180" : ""}`} />
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2">
          <pre className="max-h-96 overflow-auto rounded-xl border border-white/5 bg-black/60 p-5 font-mono text-xs text-cyan-200/80">
            {JSON.stringify(data, null, 2)}
          </pre>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
const Metric = ({ label, value }) => (
  <div>
    <div className="font-mono text-[10px] uppercase tracking-widest text-white/40">{label}</div>
    <div className="mt-1 text-2xl font-semibold text-white">{value}</div>
  </div>
);

const SimilarPostCard = ({ post }) => {
  const sim = post.similarity ?? post.score ?? post.similarity_score ?? null;
  const simPct = sim !== null ? Math.round(sim * 100) : null;
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition-colors hover:border-cyan-400/20">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-semibold text-cyan-300">
            @{post.username ?? "unknown"}
          </span>
           {post.platform && (
            <Badge variant="outline" className="border-white/20 bg-white/5 text-[10px] uppercase tracking-wider text-white/60">
              {post.platform}
            </Badge>
          )}
        </div>
        {simPct !== null && (
          <span className="font-mono text-xs text-cyan-200/70">{simPct}% match</span>
        )}
      </div>
      <p className="line-clamp-3 text-sm text-white/70">
        {post.content ?? post.text ?? "—"}
      </p>
      {post.timestamp && (
        <div className="mt-2 font-mono text-[10px] uppercase tracking-widest text-white/30">
          {post.timestamp}
        </div>
      )}
    </div>
  );
};
