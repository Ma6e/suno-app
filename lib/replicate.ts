type ReplicatePrediction = {
  id?: string;
  status?: string;
  output?: unknown;
  error?: string;
};

export async function createReplicatePrediction(input: Record<string, any>) {
  const apiToken = process.env.REPLICATE_API_TOKEN;
  const model = process.env.REPLICATE_MODEL;

  if (!apiToken) throw new Error("REPLICATE_API_TOKEN is missing");
  if (!model) throw new Error("REPLICATE_MODEL is missing");

  const response = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      Authorization: `Token ${apiToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      input,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Replicate request failed: ${text}`);
  }

  return (await response.json()) as ReplicatePrediction;
}

export async function waitForReplicatePrediction(
  predictionId: string,
  timeoutMs = 180000
): Promise<ReplicatePrediction> {
  const apiToken = process.env.REPLICATE_API_TOKEN;
  if (!apiToken) throw new Error("REPLICATE_API_TOKEN is missing");

  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    const response = await fetch(
      `https://api.replicate.com/v1/predictions/${predictionId}`,
      {
        headers: {
          Authorization: `Token ${apiToken}`,
        },
      }
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Replicate polling failed: ${text}`);
    }

    const data = (await response.json()) as ReplicatePrediction;

    if (data.status === "succeeded") return data;
    if (data.status === "failed" || data.error) {
      throw new Error(data.error || "Replicate prediction failed");
    }

    await new Promise((resolve) => setTimeout(resolve, 3000));
  }

  throw new Error("Replicate prediction timed out");
}

export function extractAudioUrl(output: unknown): string | null {
  if (!output) return null;

  if (typeof output === "string") return output;

  if (Array.isArray(output)) {
    for (const item of output) {
      const value = extractAudioUrl(item);
      if (value) return value;
    }
    return null;
  }

  if (typeof output === "object") {
    const obj = output as any;

    if (typeof obj.url === "string") return obj.url;
    if (typeof obj.audio_url === "string") return obj.audio_url;
    if (typeof obj.output === "string") return obj.output;
    if (Array.isArray(obj.output)) {
      const nested = extractAudioUrl(obj.output);
      if (nested) return nested;
    }
    if (typeof obj.result === "string") return obj.result;
    if (Array.isArray(obj.result)) {
      const nested = extractAudioUrl(obj.result);
      if (nested) return nested;
    }
  }

  return null;
}
