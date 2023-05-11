import Replicate from "replicate";
import { Configuration, OpenAIApi } from "openai";

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

    res.statusCode = 201;
    res.end(JSON.stringify(prediction));
  } else if (req.body.source == "openai") {
    const response = await openai.createImage({
      prompt: req.body.prompt,
      n: 1,
      size: "1024x1024",
      //   response_format: "b64_json",
    });

    const prediction = {
      id: req.body.predictionId,
      status: "completed",
      version: "dall-e",
      output: [response.data.data[0].url],
    };
    res.statusCode = 201;
    res.end(JSON.stringify(prediction));
  }
}
