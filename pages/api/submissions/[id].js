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
    .eq("submission_id", req.query.id)
    .order("created_at", { ascending: true });

  if (error) {
    console.log("error getting predictions for submission id ", error);
    return res.status(500).json({ error: error.message });
  }

  res.end(JSON.stringify(data));
}
