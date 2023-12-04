import { useState, useEffect } from "react";
import SaveImage from "./save-image";
import Counter from "./counter";
import { HandThumbUpIcon } from "@heroicons/react/20/solid";
import { HandThumbDownIcon } from "@heroicons/react/20/solid";
import toast, { Toaster } from "react-hot-toast";

export default function Prediction({ prediction }) {
  const [open, setOpen] = useState(false);
  const [showRating, setShowRating] = useState(true);

  function getOutput(prediction) {
    if (prediction.output) {
      return prediction.output;
    } else {
      return `${process.env.NEXT_PUBLIC_SUPABASE_IMAGES_URL}/storage/v1/object/public/images/public/${prediction.id}.png`;
    }
  }

  async function rate(id, rating) {
    const animals = ["🦓", "🦒", "🐘", "🦏", "🐪", "🐅", "🦍"];
    const animal = animals[Math.floor(Math.random() * animals.length)];
    toast(`${animal} Thanks for your feedback!`);

    const response = await fetch(`/api/ratings/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ rating, anon_id: prediction.anon_id }),
    });
    const ratingResponse = await response.json();
    setShowRating(false);
  }

  return (
    <div
      className={`h-44 w-44 sm:h-52 sm:w-52 aspect-square group relative`}
      key={prediction.id}
    >
      {prediction.status == "succeeded" && (
        <>
          <Toaster />
          <div className="relative">
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

            {showRating && (
              <>
                <button
                  onClick={() => rate(prediction.id, "thumbsUp")}
                  className="absolute bottom-3 left-2"
                >
                  <HandThumbUpIcon className="h-8 w-8 text-gray-100 bg-gray-900 bg-opacity-50 p-2 rounded-full hover:text-gray-300 hover:bg-gray-800" />
                </button>

                <button
                  onClick={() => rate(prediction.id, "thumbsDown")}
                  className="absolute bottom-3 right-2"
                >
                  <HandThumbDownIcon className="h-8 w-8 text-gray-100 bg-gray-900 bg-opacity-50 p-2 rounded-full hover:text-gray-300 hover:bg-gray-800" />
                </button>
              </>
            )}
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
