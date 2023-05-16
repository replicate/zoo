import { useState, useEffect } from "react";
import Image from "next/image";

export default function Prediction({ prediction }) {
  const [firstLoad, setFirstLoad] = useState(true);

  function getPredictionOutput(prediction) {
    // if we can get it from the storage bucket we do, but otherwise we use the output from the API
    const url = `https://ennwjiitmiqwdrgxkevm.supabase.co/storage/v1/object/public/images/public/${prediction.id}.png`;

    () => setFirstLoad(false);

    if (firstLoad) {
      return prediction.output[prediction.output.length - 1];
    } else {
      return url;
    }
  }

  return (
    <div className="h-44 w-44 aspect-square group relative" key={prediction.id}>
      {prediction.output && (
        <>
          <div className="image-wrapper rounded-lg">
            <Image
              fill
              sizes="100vw"
              src={getPredictionOutput(prediction)}
              alt="output"
              className="rounded-xl"
              loading="lazy"
            />
          </div>

          <div className="transition duration-200 absolute inset-0 bg-white bg-opacity-90 opacity-0 hover:opacity-100">
            <div className="absolute z-50 group-hover:block top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={getPredictionOutput(prediction)}
                className=""
                download={`${prediction.id}.png`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8 text-gray-900 hover:text-gray-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                  />
                </svg>
              </a>
            </div>
          </div>
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

const Counter = () => {
  const [tenthSeconds, setTenthSeconds] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTenthSeconds((tenthSeconds) => tenthSeconds + 1);
    }, 100); // now the interval is 100ms, so it increases every tenth of a second

    // cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []); // passing an empty array as the second argument to useEffect makes it run only on mount and unmount

  return (
    <div>
      <time
        className="tabular-nums"
        dateTime={`PT${(tenthSeconds / 10).toFixed(1)}S`}
      >
        {(tenthSeconds / 10).toFixed(1)}s
      </time>
    </div>
  );
};
