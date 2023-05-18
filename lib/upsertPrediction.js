import db from "./db";

function getOutput(prediction) {
  if (typeof prediction.output == "string") {
    return prediction.output;
  }
  if (prediction.output) {
    return prediction.output[prediction.output.length - 1];
  }
}

export default async function upsertPrediction(prediction) {
  if (!db) {
    console.log(
      "No Supabase ENV config found so not upserting prediction. This is fine but it means your predictions aren't saved."
    );
    return null;
  }
  const predictionObject = {
    id: prediction.id,
    input: prediction.input,
    output: prediction.output,
    status: prediction.status,
    created_at: prediction.created_at,
    started_at: prediction.started_at,
    completed_at: prediction.completed_at,
    version: prediction.version,
    metrics: prediction.metrics,
    error: prediction.error,
    model: prediction.model,
    source: prediction.source,
    anon_id: prediction.anon_id,
    submission_id: prediction.submission_id,
  };

  const { data, error } = await db
    .from("predictions")
    .upsert([predictionObject], { onConflict: "id" });

  if (error) {
    console.log("error upserting prediction ", error);
  }

  if (prediction.output && prediction.status == "succeeded") {
    console.log("uploading file to supabase...");
    await uploadImageFromUrl(getOutput(prediction), prediction.id);
  }

  return data;
}

async function uploadImageFromUrl(url, filename) {
  // Fetch the image as a Blob
  const response = await fetch(url);
  const blob = await response.blob();

  const { data, error } = await db.storage
    .from("images")
    .upload(`public/${filename}.png`, blob, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("Error uploading file:", error);
    return;
  }

  console.log(`File uploaded to: ${filename}. Data: ${JSON.stringify(data)}`);
}
