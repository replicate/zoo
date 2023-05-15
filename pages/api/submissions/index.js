import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  console.log(req.body.predictionIDs);
  const { data, error } = await supabase.from("submissions").upsert({
    id: req.body.id,
    prompt: req.body.prompt,
    prediction_ids: req.body.predictionIDs,
  });

  res.end(JSON.stringify(data));
}
