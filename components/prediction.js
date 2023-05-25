import { useState, useEffect } from "react";
import SaveImage from "./save-image";
import Counter from "./counter";

export default function Prediction({ prediction }) {
  const [url, setUrl] = useState(null);
  const [open, setOpen] = useState(false);

  function getTempOutput(prediction) {
    if (prediction.source == "stability") {
      return `data:image/png;base64,${prediction.output}`;
    }
    if (typeof prediction.output == "string") {
      return prediction.output;
    }
    if (prediction.output) {
      return prediction.output[prediction.output.length - 1];
    }
  }

  async function getOutput(prediction) {
    const url = `https://ennwjiitmiqwdrgxkevm.supabase.co/storage/v1/object/public/images/public/${prediction.id}.png`;
    let response = await fetch(url);

    if (response.status == 200) {
      setUrl(url);
      return url;
    } else {
      const tempUrl = getTempOutput(prediction);
      setUrl(tempUrl);
      return tempUrl;
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
              className="image-wrapper rounded-lg hover:opacity-75"
            >
              <img
                src={url}
                alt="output"
                className={`rounded-xl aspect-square`}
                loading="lazy"
              />
            </button>
          </div>
          <SaveImage
            open={open}
            setOpen={setOpen}
            prediction={prediction}
            url={url}
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
