import { Configuration, OpenAIApi } from "openai";
import upsertPrediction from "../../../lib/upsertPrediction";
import packageData from "../../../package.json";

const REPLICATE_API_HOST = "https://api.replicate.com";

const WEBHOOK_HOST = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : process.env.NGROK_HOST;

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

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

  if (req.body.source == "replicate") {
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
  } else if (req.body.source == "openai") {
    const response = await openai.createImage({
      prompt: req.body.prompt,
      n: 1,
      size: "512x512",
    });

    const prediction = {
      id: req.body.id,
      status: "succeeded",
      version: "dall-e",
      output: [response.data.data[0].url],
      input: { prompt: req.body.prompt },
      model: req.body.model,
      inserted_at: new Date(),
      created_at: new Date(),
      submission_id: req.body.submission_id,
      source: req.body.source,
      model: req.body.model,
      anon_id: req.body.anon_id,
    };

    upsertPrediction(prediction);

    res.statusCode = 201;
    res.end(JSON.stringify(prediction));
  }
}
