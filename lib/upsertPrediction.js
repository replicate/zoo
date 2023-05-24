import db from "./db";

function getOutput(prediction) {
  if (typeof prediction.output == "string") {
    return prediction.output;
  }
  if (prediction.output) {
    return prediction.output[prediction.output.length - 1];
  }
}

function getAnnotatedOutput(prediction) {
  if (prediction.output) {
    return prediction.output[0];
  }
}

export default async function upsertPrediction(prediction) {
  if (!db) {
    console.log(
      "No Supabase ENV config found so not upserting prediction. This is fine but it means your predictions aren't saved."
    );
    return null;
  }

  const predictionObject = {
    id: prediction.id,
    input: prediction.input,
    output: prediction.output,
    status: prediction.status,
    created_at: prediction.created_at,
    started_at: prediction.started_at,
    completed_at: prediction.completed_at,
    version: prediction.version,
    metrics: prediction.metrics,
    error: prediction.error,
    model: prediction.model,
    source: prediction.source,
    anon_id: prediction.anon_id,
    submission_id: prediction.submission_id,
    control_image: prediction.input.image,
  };

  const { data, error } = await db
    .from("predictions")
    .upsert([predictionObject], { onConflict: "id" });

  if (error) {
    console.log("error upserting prediction ", error);
  }

  console.log(`prediction ${JSON.stringify(predictionObject.id)} upserted`);

  if (prediction.output && prediction.status == "succeeded") {
    await uploadImageFromData(
      getOutput(prediction),
      prediction.id,
      prediction.source == "stability"
    );

    if (predictionObject.control_image) {
      await uploadImageFromData(
        getAnnotatedOutput(prediction),
        `annotated-${prediction.id}`,
        false
      );
    }
  }

  return data;
}

async function uploadImageFromData(data, filename, isBase64 = false) {
  let blob;

  if (isBase64) {
    // convert base64 to Blob
    const base64Data = data;
    blob = Buffer.from(base64Data, "base64");

    // // Save Blob as a local file
    // const readableStreamForFile = Stream.Readable.from(blob);
    // const writableStreamForFile = fs.createWriteStream(`./${filename}.png`);
    // readableStreamForFile.pipe(writableStreamForFile);
  } else {
    // fetch the image as a Blob
    const response = await fetch(data);
    blob = await response.blob();
  }

  const { data: uploadData, error } = await db.storage
    .from("images")
    .upload(`public/${filename}.png`, blob, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("Error uploading file:", error);
    return;
  }

  console.log(
    `File uploaded to: ${filename}. Data: ${JSON.stringify(uploadData)}`
  );
}
