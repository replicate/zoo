import { createClient } from "@supabase/supabase-js";
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function upsertPrediction(
  prediction,
  model,
  source,
  anonID
) {
  const predictionObject = {
    uuid: prediction.id,
    input: prediction.input,
    output: prediction.output,
    status: prediction.status,
    created_at: prediction.created_at,
    started_at: prediction.started_at,
    completed_at: prediction.completed_at,
    version: prediction.version,
    metrics: prediction.metrics,
    error: prediction.error,
    model: model,
    source: source,
    anon_id: anonID,
  };

  const { data, error } = await supabase
    .from("predictions")
    .upsert([predictionObject], { onConflict: "uuid" });

  if (error) {
    console.log(error);
    return error;
  }

  return data;
}
