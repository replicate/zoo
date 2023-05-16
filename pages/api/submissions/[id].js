import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  const { data, error } = await supabase
    .from("predictions")
    .select()
    .eq("submission_id", req.query.id)
    .order("created_at", { ascending: true });

  if (error) {
    console.log("error getting predictions for submission id ", error);
    return res.status(500).json({ error: error.message });
  }

  res.end(JSON.stringify(data));
}
