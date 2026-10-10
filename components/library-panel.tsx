import { Headphones, Clock3 } from "lucide-react";

type SongRecord = {
  id: string;
  title: string;
  prompt: string;
  created_at: string;
  audio_url: string;
};

export function LibraryPanel({ songs }: { songs: SongRecord[] }) {
  return (
    <aside className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-xl border border-white/10 bg-white/5 p-2">
          <Headphones className="h-4 w-4 text-[#7c9cff]" />
        </div>
        <h3 className="text-lg font-semibold text-white">Library</h3>
      </div>

      <div className="space-y-3">
        {songs.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/10 bg-slate-950/20 p-4 text-sm text-slate-400">
            No tracks yet. Generate your first song.
          </div>
        ) : (
          songs.map((song) => (
            <div key={song.id} className="rounded-xl border border-white/10 bg-slate-950/30 p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-white">{song.title}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-slate-400">{song.prompt}</p>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
                <Clock3 className="h-3.5 w-3.5" />
                {new Date(song.created_at).toLocaleDateString()}
              </div>

              <audio controls className="mt-3 w-full" src={song.audio_url} />
            </div>
          ))
        )}
      </div>
    </aside>
  );
}
