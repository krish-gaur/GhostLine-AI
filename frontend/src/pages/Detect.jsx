import { useState } from "react";
import { Button } from "../components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "../components/ui/toggle-group";
import { toast } from "../components/ui/sonner";
import { Plus, Play, Loader2, Shield, ArrowLeft } from "lucide-react";
import { StarField } from "../components/StarField";
import PostForm from "../components/PostForm";
import { Results } from "../components/Results";
import { analyzePosts, DETECTION_API_URL } from "../lib/api";

const emptyPost = () => ({
  id:
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `p-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
  username: "",
  timestamp: new Date().toISOString().slice(0, 16),
  content: "",
  platform: "x",
});

const MODES = {
  single: {
    label: "Single Post",
    sub: "Ingest one post into the vector store",
    max: 1,
  },
  bulk: {
    label: "Bulk Coordination",
    sub: "Analyze up to 10 posts for coordinated behavior",
    max: 10,
  },
};

export default function Detect() {
  const [mode, setMode] = useState("bulk");
  const [posts, setPosts] = useState([emptyPost()]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const cfg = MODES[mode];

  const switchMode = (next) => {
    if (!next || next === mode) return;
    setMode(next);
    setResult(null);
    setError(null);
    setPosts(next === "single" ? [emptyPost()] : [emptyPost(), emptyPost()]);
  };

  const updatePost = (i, next) =>
    setPosts((prev) => prev.map((p, idx) => (idx === i ? next : p)));

  const addPost = () => {
    if (posts.length >= cfg.max) return;
    setPosts((prev) => [...prev, emptyPost()]);
  };

  const removePost = (i) =>
    setPosts((prev) => prev.filter((_, idx) => idx !== i));

  const validate = () => {
    for (let i = 0; i < posts.length; i++) {
      const p = posts[i];
      if (!p.username.trim() || !p.content.trim() || !p.platform) {
        toast.error(`Post #${i + 1} is missing required fields`);
        return false;
      }
    }

    if (mode === "bulk" && posts.length < 2) {
      toast.error("Bulk mode needs at least 2 posts");
      return false;
    }

    return true;
  };

  const submit = async () => {
    if (!validate()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    const payload = posts.map((p) => ({
      username: p.username,
      content: p.content,
      platform: p.platform,
      timestamp: new Date(p.timestamp).toISOString(),
    }));

    try {
      const data = await analyzePosts(payload);
      setResult(data);
      toast.success("Analysis complete");
    } catch (e) {
      const msg =
        e?.response?.data?.detail ||
        e?.response?.data?.message ||
        e?.message ||
        "Request failed";

      setError(msg);
      toast.error(`Backend error: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen font-[Manrope] text-white">
      <StarField />

      {/* Header */}
      <header className="relative z-10 border-b border-white/5 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-cyan-400 to-emerald-400">
              <Shield className="h-4 w-4 text-black" />
            </div>
            <div>
              <div className="text-sm font-bold tracking-tight">
                GhostLine AI
              </div>
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
                Detection Console
              </div>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.history.back()}
            className="text-white/60 hover:bg-white/5 hover:text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
      </header>

      {/* Main */}
      <main className="relative z-10 mx-auto max-w-6xl px-6 py-10">
        <div className="mb-10">
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
            Run Detection
          </h1>
          <p className="mt-3 text-sm text-white/60">
            Detect coordinated behavior using AI pipeline
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="mb-8 flex justify-between">
          <ToggleGroup
            type="single"
            value={mode}
            onValueChange={switchMode}
          >
            {Object.entries(MODES).map(([key, m]) => (
              <ToggleGroupItem key={key} value={key}>
                {m.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        {/* Forms */}
        <div className="space-y-4">
          {posts.map((post, i) => (
            <PostForm
              key={post.id}
              index={i}
              post={post}
              onChange={(p) => updatePost(i, p)}
              onRemove={() => removePost(i)}
              removable={mode === "bulk" && posts.length > 2}
            />
          ))}
        </div>

        {/* Add Post */}
        {mode === "bulk" && posts.length < cfg.max && (
          <Button onClick={addPost} className="mt-4 w-full">
            <Plus className="mr-2 h-4 w-4" />
            Add Post
          </Button>
        )}

        {/* Submit */}
        <div className="mt-10 flex justify-between">
          <div className="text-xs text-white/40">
            Backend → {DETECTION_API_URL}
          </div>

          <Button onClick={submit} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Detect
              </>
            )}
          </Button>
        </div>

        {/* Error */}
        {error && <div className="mt-6 text-red-400">{error}</div>}

        {/* Result */}
        {result && (
          <div className="mt-10">
            <Results data={result} />
          </div>
        )}
      </main>
    </div>
  );
}