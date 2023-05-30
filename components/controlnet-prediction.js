import { useState, useEffect } from "react";
import SaveImage from "./save-image";
import Counter from "./counter";

export default function ControlnetPrediction({ prediction }) {
  const [url, setUrl] = useState(null);
  const [annotatedUrl, setAnnotatedUrl] = useState(null);
  const [open, setOpen] = useState(false);

  function getTempOutput(prediction) {
    if (typeof prediction.output == "string") {
      return prediction.output;
    }
    return prediction.output[prediction.output.length - 1];
  }

  function getTempAnnotatedOutput(prediction) {
    return prediction.output[0];
  }

  async function getOutput(prediction) {
    const bucket = `https://ennwjiitmiqwdrgxkevm.supabase.co/storage/v1/object/public/images/public`;
    const predictionUrl = `${bucket}/${prediction.id}.png`;
    const predictionAnnotationUrl = `${bucket}/annotated-${prediction.id}.png`;

    let response = await fetch(predictionUrl);

    if (prediction.output) {
      if (response.status == 200) {
        setUrl(predictionUrl);
        setAnnotatedUrl(predictionAnnotationUrl);
        return url;
      } else {
        setUrl(getTempOutput(prediction));
        setAnnotatedUrl(getTempAnnotatedOutput(prediction));
      }
    }
  }

  useEffect(() => {
    getOutput(prediction);
  }, [prediction]);

  return (
    <div
      className={`h-44 w-44 sm:h-52 sm:w-52 aspect-square group relative`}
      key={prediction.id}
    >
      {prediction.output && url && (
        <>
          <div>
            <button
              onClick={() => setOpen(true)}
              className="image-wrapper image-wrapper--controlnet rounded-xl hover:opacity-75"
            >
              <img
                src={url}
                alt="output"
                className={`rounded-xl aspect-square prediction-image`}
                loading="lazy"
              />
              <img
                src={annotatedUrl}
                alt="output"
                className={`rounded-xl aspect-square prediction-annotated-image`}
                loading="lazy"
              />
            </button>
          </div>

          <SaveImage
            open={open}
            setOpen={setOpen}
            prediction={prediction}
            url={url}
            annotatedUrl={annotatedUrl}
          />
        </>
      )}

      {!prediction.output && prediction.error && (
        <div className="border border-gray-300 py-3 text-sm opacity-50 flex items-center justify-center aspect-square rounded-lg">
          <span className="mx-12">{prediction.error}</span>
        </div>
      )}

      {!prediction.output && !prediction.error && (
        <div className="border border-gray-300 py-3 text-sm opacity-50 flex items-center justify-center aspect-square rounded-lg">
          <Counter />
        </div>
      )}
    </div>
  );
}
