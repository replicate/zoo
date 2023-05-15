import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  const { data, error } = await supabase
    .from("submissions")
    .select()
    .eq("id", req.query.id)
    .order("created_at", { ascending: false });

  console.log(data);
  let predictions = [];

  for (let i = 0; i < data[0].prediction_ids.length; i++) {
    const { data: predictionData, error: predictionError } = await supabase
      .from("predictions")
      .select()
      .eq("uuid", data[0].prediction_ids[i])
      .order("created_at", { ascending: false });
    console.log("predictionData", predictionData[0]);
    predictions.push(predictionData[0]);
  }

  res.end(JSON.stringify({ prompt: data[0].prompt, predictions: predictions }));
}
