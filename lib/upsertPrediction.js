import { createClient } from "@supabase/supabase-js";
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function upsertPrediction(prediction) {
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
    model: prediction.model,
    source: prediction.source,
    anon_id: prediction.anon_id,
    submission_id: prediction.submission_id,
  };

  const { data, error } = await supabase
    .from("predictions")
    .upsert([predictionObject], { onConflict: "uuid" });

  if (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }

  return data;
}
