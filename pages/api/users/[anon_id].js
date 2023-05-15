import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  const { data, error } = await supabase
    .from("predictions")
    .select()
    .eq("anon_id", req.query.anon_id)
    .order("created_at", { ascending: false });

  if (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }

  res.end(JSON.stringify(data));
}
