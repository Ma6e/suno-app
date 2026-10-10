"use client";

import { useState } from "react";
import { Sparkles, Music4, LoaderCircle, Download } from "lucide-react";

type SongResult = {
  title: string;
  audioUrl: string;
  prompt: string;
};

export function SongGenerator({ user }: { user: any }) {
  const [prompt, setPrompt] = useState("Dreamy indie pop about midnight city lights");
  const [style, setStyle] = useState("indie pop");
  const [mood, setMood] = useState("dreamy");
  const [length, setLength] = useState("90");
  const [voice, setVoice] = useState("female");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SongResult | null>(null);

  async function handleGenerate() {
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          style,
          mood,
          duration: Number(length),
          voice,
          userId: user.id,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to generate track");
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setResult({
        title: "Demo track",
        prompt,
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-2xl">
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <Sparkles className="h-5 w-5 text-[#7c9cff]" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Create</p>
          <h2 className="text-2xl font-bold text-white">New song</h2>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm text-slate-300">Prompt</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={5}
            className="w-full rounded-xl border border-white/10 bg-slate-950/50 p-3 text-white outline-none placeholder:text-slate-500"
            placeholder="Describe your song..."
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-2 block text-sm text-slate-300">Style</label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-950/50 p-3 text-white"
            >
              <option>indie pop</option>
              <option>lofi</option>
              <option>rock</option>
              <option>ambient</option>
              <option>hip-hop</option>
              <option>electronic</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">Mood</label>
            <select
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-950/50 p-3 text-white"
            >
              <option>dreamy</option>
              <option>uplifting</option>
              <option>moody</option>
              <option>energetic</option>
              <option>romantic</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-2 block text-sm text-slate-300">Length</label>
            <select
              value={length}
              onChange={(e) => setLength(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-950/50 p-3 text-white"
            >
              <option value="45">45 sec</option>
              <option value="90">90 sec</option>
              <option value="120">2 min</option>
              <option value="180">3 min</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">Voice</label>
            <select
              value={voice}
              onChange={(e) => setVoice(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-950/50 p-3 text-white"
            >
              <option>female</option>
              <option>male</option>
              <option>instrumental</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#7c9cff] to-[#5de4c6] px-4 py-3 font-semibold text-slate-950 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? (
            <>
              <LoaderCircle className="h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Music4 className="h-4 w-4" />
              Generate Song
            </>
          )}
        </button>
      </div>

      {result && (
        <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/40 p-4">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Result</p>
              <h3 className="text-xl font-semibold text-white">{result.title}</h3>
            </div>

            <button className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100">
              <Download className="h-4 w-4" />
              Download
            </button>
          </div>

          <audio controls className="w-full" src={result.audioUrl} />

          <div className="mt-4 rounded-xl border border-[#7c9cff]/20 bg-[#7c9cff]/5 p-3">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Prompt</p>
            <p className="mt-2 text-slate-200">{result.prompt}</p>
          </div>
        </div>
      )}
    </div>
  );
}
