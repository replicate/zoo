import Replicate from "replicate";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export default async function handler(req, res) {
  const prediction = await replicate.predictions.get(req.query.id);

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
  };

  const { data, error } = await supabase
    .from("predictions")
    .upsert([predictionObject], { onConflict: "uuid" });

  console.log(data, error);

  res.end(JSON.stringify(prediction));
}
