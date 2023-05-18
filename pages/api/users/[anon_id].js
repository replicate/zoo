import db from "../../../lib/db";

export default async function handler(req, res) {
  if (!db) {
    console.log("No Supabase ENV config found. Returning empty list.");
    res.end(JSON.stringify([]));
    return;
  }

  const { data, error } = await db
    .from("predictions")
    .select()
    .eq("anon_id", req.query.anon_id)
    .limit(50)
    .order("created_at", { ascending: false });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.end(JSON.stringify(data));
}
