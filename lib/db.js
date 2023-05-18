import { createClient } from "@supabase/supabase-js";

let db = null;

if (process.env.SUPABASE_URL) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_KEY;
  db = createClient(supabaseUrl, supabaseKey);
}

module.exports = db;
