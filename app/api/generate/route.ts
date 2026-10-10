import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { generateSongWithProvider } from "@/lib/music-provider";

export async function POST(request: Request) {
  const body = await request.json();

  if (!body.prompt || !body.prompt.trim()) {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
  }

  const supabase = createServerSupabaseClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = authData.user.id;

  const { data: profile } = await supabase
    .from("profiles")
    .select("credits")
    .eq("id", userId)
    .single();

  if (profile && profile.credits <= 0) {
    return NextResponse.json({ error: "No credits left" }, { status: 402 });
  }

  try {
    const generated = await generateSongWithProvider({
      prompt: body.prompt,
      style: body.style || "indie pop",
      mood: body.mood || "dreamy",
      duration: body.duration || 90,
      voice: body.voice || "female",
    });

    const { error: insertError } = await supabase.from("generated_songs").insert([
      {
        user_id: userId,
        title: generated.title,
        prompt: body.prompt,
        style: generated.style,
        mood: generated.mood,
        duration: generated.duration,
        voice: generated.voice,
        audio_url: generated.audioUrl,
      },
    ]);

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    if (profile) {
      await supabase
        .from("profiles")
        .update({ credits: profile.credits - 1 })
        .eq("id", userId);
    }

    return NextResponse.json({
      title: generated.title,
      prompt: generated.prompt,
      audioUrl: generated.audioUrl,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Generation failed" },
      { status: 500 }
    );
  }
}
