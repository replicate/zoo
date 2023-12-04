import db from "../../../lib/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const {data, error} = await db.from("predictions").select().eq('id', req.query.id)

    if (error) {
      console.log("error retrieving prediction ", error, req.body);
      return res.status(500).json({ error: error.message });
    }

    // If the prediction is not found, we are still waiting on the webhook
    // so we just return success with an unknown status and id.
    // TODO: We could store the initial prediction in the db on creation
    // time but then we'd potentially be storing failed and partial
    // predictions.
    if (data.length === 0) {
      return res.status(200).json({ id: req.query.id, status: "unknown"  });
    }

    res.end(JSON.stringify(data[0]));
  } else if (req.method === "PUT") {
    const { data, error } = await db
      .from("predictions")
      .update({ submission_id: req.body.submission_id })
      .eq("id", req.query.id);

    if (error) {
      console.log("error updating prediction ", error);
      console.log("body: ", req.body);
      return res.status(500).json({ error: error.message });
    }

    console.log("prediction updated!", data);

    res.end(JSON.stringify(data));
  }
}
