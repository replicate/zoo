import db from "../../../lib/db";

export default async function handler(req, res) {
  const { data, error } = await db
    .from("ratings")
    .insert([
      {
        prediction_id: req.query.id,
        rating: req.body.rating,
        anon_id: req.body.anon_id,
      },
    ])
    .select();

  if (error) {
    console.log("error updating rating ", error);
    console.log("body: ", req.body);
    return res.status(500).json({ error: error.message });
  }

  console.log("rating added!", data);

  res.end(JSON.stringify(data));
}
