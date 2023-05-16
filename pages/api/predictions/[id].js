import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export default async function handler(req, res) {
  const prediction = await replicate.predictions.get(req.query.id);

  res.end(JSON.stringify(prediction));
}
