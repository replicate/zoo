import packageData from "../../../package.json";

const REPLICATE_API_HOST = "https://api.replicate.com";

const WEBHOOK_HOST = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : process.env.NGROK_HOST;

export default async function handler(req, res) {
  if (!process.env.REPLICATE_API_TOKEN) {
    throw new Error(
      "The REPLICATE_API_TOKEN environment variable is not set. See README.md for instructions on how to set it."
    );
  }

  if (!WEBHOOK_HOST) {
    throw new Error(
      "WEBHOOK HOST is not set. If you're on local, make sure you set it to an ngrok url. If this doesn't exist, replicate predictions won't save to DB."
    );
  }

  console.log("host", WEBHOOK_HOST);

  const searchParams = new URLSearchParams({
    submission_id: req.body.submission_id,
    model: req.body.model,
    anon_id: req.body.anon_id,
    source: req.body.source,
  });

  const body = JSON.stringify({
    input: {
      prompt: req.body.prompt,
      image_dimensions: req.body.image_dimensions,
    },
    version: req.body.version,
    webhook: `${WEBHOOK_HOST}/api/replicate-webhook?${searchParams}`,
    webhook_events_filter: ["start", "completed"],
  });

  const headers = {
    Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
    "Content-Type": "application/json",
    "User-Agent": `${packageData.name}/${packageData.version}`,
  };

  const response = await fetch(`${REPLICATE_API_HOST}/v1/predictions`, {
    method: "POST",
    headers,
    body,
  });

  if (response.status !== 201) {
    let error = await response.json();
    res.statusCode = 500;
    res.end(JSON.stringify({ detail: error.detail }));
    return;
  }

  const prediction = await response.json();
  res.statusCode = 201;
  res.end(JSON.stringify(prediction));
}
