import {
  createReplicatePrediction,
  waitForReplicatePrediction,
  extractAudioUrl,
} from "./replicate";

type GenerateSongInput = {
  prompt: string;
  style: string;
  mood: string;
  duration: number;
  voice: string;
};

type GeneratedSong = {
  title: string;
  audioUrl: string;
  prompt: string;
  style: string;
  mood: string;
  duration: number;
  voice: string;
};

export async function generateSongWithProvider({
  prompt,
  style,
  mood,
  duration,
  voice,
}: GenerateSongInput): Promise<GeneratedSong> {
  const prediction = await createReplicatePrediction({
    prompt,
    style,
    mood,
    duration,
    voice,
  });

  if (!prediction.id) {
    throw new Error("Replicate did not return a prediction ID");
  }

  const completed = await waitForReplicatePrediction(prediction.id);

  const audioUrl = extractAudioUrl(completed.output);

  if (!audioUrl) {
    throw new Error("No audio URL returned from Replicate");
  }

  return {
    title: `${style} — ${mood}`,
    audioUrl,
    prompt,
    style,
    mood,
    duration,
    voice,
  };
}
