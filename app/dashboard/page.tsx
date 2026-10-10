import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { SongGenerator } from "@/components/song-generator";
import { UserSummary } from "@/components/user-summary";
import { LibraryPanel } from "@/components/library-panel";

export default async function DashboardPage() {
  const supabase = createServerSupabaseClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  const { data: songs } = await supabase
    .from("generated_songs")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10);

  const { data: profile } = await supabase
    .from("profiles")
    .select("credits, full_name")
    .eq("id", user.id)
    .single();

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <UserSummary
        user={user}
        credits={profile?.credits ?? 5}
        name={profile?.full_name ?? user.email ?? "Creator"}
      />
      <div className="mt-8 grid gap-8 xl:grid-cols-[1.4fr_0.7fr]">
        <SongGenerator user={user} />
        <LibraryPanel songs={songs ?? []} />
      </div>
    </div>
  );
}
