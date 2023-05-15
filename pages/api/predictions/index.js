import Replicate from "replicate";
import { Configuration, OpenAIApi } from "openai";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

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

  if (req.body.source == "replicate") {
    const prediction = await replicate.predictions.create({
      // This is the text prompt that will be submitted by a form on the frontend
      input: { prompt: req.body.prompt },
      version: req.body.version,
    });

    if (prediction?.error) {
      res.statusCode = 500;
      res.end(JSON.stringify({ detail: prediction.error }));
      return;
    }

    insertDB(prediction, req);

    res.statusCode = 201;
    res.end(JSON.stringify(prediction));
  } else if (req.body.source == "openai") {
    const response = await openai.createImage({
      prompt: req.body.prompt,
      n: 1,
      size: "512x512",
    });

    const prediction = {
      id: req.body.predictionId,
      status: "completed",
      version: "dall-e",
      output: [response.data.data[0].url],
      input: { prompt: req.body.prompt },
      model: req.body.model,
      inserted_at: new Date(),
      created_at: new Date(),
    };

    insertDB(prediction, req);

    res.statusCode = 201;
    res.end(JSON.stringify(prediction));
  }
}

async function insertDB(prediction, req) {
  const predictionObject = {
    anon_id: req.body.anonID,
    uuid: prediction.id,
    input: prediction.input,
    output: prediction.output,
    status: prediction.status,
    created_at: prediction.created_at,
    started_at: prediction.started_at,
    completed_at: prediction.completed_at,
    version: prediction.version,
    metrics: prediction.metrics,
    error: prediction.error,
    model: req.body.model,
    source: req.body.source,
  };

  const { data, error } = await supabase
    .from("predictions")
    .upsert([predictionObject], { onConflict: "uuid" });

  console.log(data, error);
}
