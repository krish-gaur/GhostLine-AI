import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Button } from "../components/ui/button";
import { X } from "lucide-react";

const PLATFORMS = ["x", "instagram", "facebook"];

const PostForm = ({ index, post, onChange, onRemove, removable }) => {
  const update = (field, value) => onChange({ ...post, [field]: value });

  return (
    <div className="relative rounded-2xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-sm transition-all hover:border-cyan-400/30 hover:bg-white/[0.04]">
      
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-300/70">
          Post #{String(index + 1).padStart(2, "0")}
        </span>

        {removable && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="h-7 w-7 rounded-full p-0 text-white/50 hover:bg-red-500/10 hover:text-red-400"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>

      {/* Form Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        
        {/* Username */}
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-white/60">
            Username
          </Label>
          <Input
            value={post.username}
            onChange={(e) => update("username", e.target.value)}
            placeholder="user123"
            className="border-white/10 bg-black/40 text-white placeholder:text-white/30 focus-visible:ring-cyan-400/50"
          />
        </div>

        {/* Platform Select */}
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-white/60">
            Platform
          </Label>

          <Select
            value={post.platform}
            onValueChange={(v) => update("platform", v)}
          >
            <SelectTrigger className="border-white/10 bg-black/40 text-white focus:ring-cyan-400/50">
              <SelectValue
                value={post.platform}
                placeholder="Select platform"
              />
            </SelectTrigger>

            <SelectContent className="border-white/10 bg-zinc-950 text-white">
              {PLATFORMS.map((p) => (
                <SelectItem
                  key={p}
                  value={p}
                  className="capitalize focus:bg-cyan-400/10 focus:text-cyan-200"
                >
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Timestamp */}
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-white/60">
            Timestamp
          </Label>
          <Input
            type="datetime-local"
            value={post.timestamp}
            onChange={(e) => update("timestamp", e.target.value)}
            className="border-white/10 bg-black/40 text-white placeholder:text-white/30 focus-visible:ring-cyan-400/50"
          />
        </div>
      </div>

      {/* Content */}
      <div className="mt-4 space-y-1.5">
        <Label className="text-xs font-medium text-white/60">
          Content
        </Label>
        <Textarea
          value={post.content}
          onChange={(e) => update("content", e.target.value)}
          placeholder="Paste the post content here..."
          rows={3}
          className="resize-none border-white/10 bg-black/40 text-white placeholder:text-white/30 focus-visible:ring-cyan-400/50"
        />
      </div>
    </div>
  );
};

export default PostForm;