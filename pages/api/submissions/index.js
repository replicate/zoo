import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  const { data, error } = await supabase
    .from("submissions")
    .upsert({
      id: req.body.id,
      prompt: req.body.prompt,
    })
    .select();

  if (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }

  console.log("submission", data);
  res.end(JSON.stringify(data));
}
