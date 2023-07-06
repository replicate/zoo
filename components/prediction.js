import { useState, useEffect } from "react";
import SaveImage from "./save-image";
import Counter from "./counter";

export default function Prediction({ prediction }) {
  const [open, setOpen] = useState(false);

  function getOutput(prediction) {
    if (prediction.output) {
      return prediction.output;
    } else {
      return `https://ennwjiitmiqwdrgxkevm.supabase.co/storage/v1/object/public/images/public/${prediction.id}.png`;
    }
  }

  return (
    <div
      className={`h-44 w-44 sm:h-52 sm:w-52 aspect-square group relative`}
      key={prediction.id}
    >
      {prediction.status == "succeeded" && (
        <>
          <div>
            <button
              onClick={() => setOpen(true)}
              className="image-wrapper rounded-lg hover:opacity-75"
            >
              <img
                src={getOutput(prediction)}
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
            url={getOutput(prediction)}
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
