import { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import promptmaker from "promptmaker";
import Link from "next/link";
import MODELS from "../src/models.js";
import { v4 as uuidv4 } from "uuid";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function Home() {
  const [prompt, setPrompt] = useState(promptmaker());
  const [predictions, setPredictions] = useState([]);
  const [error, setError] = useState(null);
  const [numOutputs, setNumOutputs] = useState(3);
  const [loading, setLoading] = useState(false);

  const [models, setModels] = useState(MODELS);

  function getSelectedModels() {
    return models.filter((m) => m.checked);
  }

  function getPredictionsByVersion(version) {
    return predictions.filter((p) => p.version === version);
  }

  function anyPredictionsLoading() {
    return predictions.some((p) => p.output === null);
  }

  function getPredictionOutput(model, prediction) {
    if (model.source == "replicate") {
      return prediction.output[prediction.output.length - 1];
    } else if (model.source == "openai") {
      return `data:image/png;base64,${
        prediction.output[prediction.output.length - 1]
      }`;
    }
  }

  const handleCheckboxChange = (e) => {
    const modelId = parseInt(e.target.value, 10);

    // Update the checked flag for the model with the matching modelId
    const updatedModels = models.map((model) => {
      if (model.id === modelId) {
        return {
          ...model,
          checked: e.target.checked,
        };
      }
      return model;
    });

    // Set the new models array
    setModels(updatedModels);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 2000);

    for (const model of getSelectedModels()) {
      // Use the model variable to generate predictions with the selected model
      // Update the API call or any other logic as needed to use the selected model
      for (let i = 0; i < numOutputs; i++) {
        const predictionId = uuidv4();
        let prediction = null;

        if (model.source == "replicate") {
          const response = await fetch("/api/predictions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              prompt: e.target.prompt.value,
              version: model.version,
              source: model.source,
            }),
          });

          prediction = await response.json();

          if (response.status !== 201) {
            setError(prediction.detail);
            return;
          }
          setPredictions((prev) => [...prev, prediction]);
        } else if (model.source == "openai") {
          // setup a fake prediction with a loading state, because DALL-E predictions are synchronous
          prediction = {
            id: predictionId,
            output: null,
            status: "processing",
            version: "dall-e",
          };

          setPredictions((prev) => [...prev, prediction]);
        }

        const updatePrediction = async () => {
          if (model.source == "replicate") {
            while (
              prediction.status !== "succeeded" &&
              prediction.status !== "failed"
            ) {
              await sleep(1000);
              const response = await fetch("/api/predictions/" + prediction.id);
              prediction = await response.json();
              if (response.status !== 200) {
                setError(prediction.detail);
                return;
              }
              setPredictions((prev) =>
                prev.map((item) =>
                  item.id === prediction.id ? prediction : item
                )
              );
            }
          } else if (model.source == "openai") {
            const response = await fetch("/api/predictions", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                prompt: e.target.prompt.value,
                version: model.version,
                source: model.source,
                predictionId: predictionId,
              }),
            });

            let prediction = await response.json();
            setPredictions((prev) =>
              prev.map((item) =>
                item.id === prediction.id ? prediction : item
              )
            );
          }
        };

        updatePrediction();
      }
    }
  };

  return (
    <div className="mx-auto container p-5">
      <Head>
        <title>🐈‍⬛ Playground</title>
      </Head>

      <nav>
        <div className="sm:flex">
          <div className="mb-4 flex-shrink-0 sm:mb-0 sm:mr-4">
            <span className="text-4xl">🦓</span>
          </div>
          <div className="flex">
            <h4 className="text-lg items-center flex font-bold justify-center">
              Zoo{" "}
              <span className="text-zinc-500 ml-1 font-light">
                Image Playground
              </span>
            </h4>
          </div>
        </div>
      </nav>

      <div className="grid grid-cols-12 gap-x-16 mt-12">
        {/* Form + Outputs */}
        <div className="col-span-10 h-full">
          <div className="h-24">
            <form className="w-full" onSubmit={handleSubmit}>
              <div className="flex relative">
                <div className="w-full h-full relative">
                  <textarea
                    name="prompt"
                    className="w-full border-2 p-3 rounded-md"
                    rows="1"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Enter a prompt to display an image"
                  />

                  <button
                    className="absolute right-2 top-2 text-gray-500 hover:text-gray-900 px-1 py-2 rounded-md flex justify-center items-center"
                    type="button"
                    onClick={() => setPrompt(promptmaker())}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                      />
                    </svg>
                  </button>
                </div>

                <div className="ml-3 mb-1.5 inline-flex">
                  {loading || anyPredictionsLoading() ? (
                    <button
                      className="h-full font-bold loading-button"
                      type="button"
                      disabled
                    >
                      Loading...
                    </button>
                  ) : (
                    <button
                      className="button h-full font-bold hover:bg-slate-800"
                      type="submit"
                    >
                      Go
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>

          <div>
            {getSelectedModels().length == 0 && <EmptyState />}

            {getSelectedModels().map((model) => (
              <div key={model.id} className="mt-5">
                <div className="grid grid-cols-4 gap-6 tracking-wide mb-10">
                  <div className="border-l-4 border-gray-900 pl-6 py-2">
                    <Link
                      href={`https://replicate.com/${model.owner.toLowerCase()}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <h5 className="text-sm text-gray-500 hover:text-gray-900">
                        {model.owner}
                      </h5>
                    </Link>
                    <Link
                      href={model.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <h5 className="text-xl font-medium text-gray-800 hover:text-gray-500">
                        {model.name}
                      </h5>
                    </Link>
                    <p className="text-sm  text-gray-500 mt-4">
                      {model.description}
                    </p>

                    <div className="mt-6 flex">
                      {model.links != null &&
                        model.links.map((link) => (
                          <a key={`link-${model.name}`} href={link.url}>
                            <img
                              src={`/${link.name}.png`}
                              alt={link.name}
                              className={
                                model.source == "openai" ? "h45 w-4" : "h-6 w-6"
                              }
                            />
                          </a>
                        ))}
                    </div>
                  </div>
                  {getPredictionsByVersion(model.version).map((prediction) => (
                    <div className="group relative" key={prediction.id}>
                      {prediction.output && (
                        <>
                          {console.log(getPredictionOutput(model, prediction))}
                          <div className="image-wrapper rounded-lg">
                            <Image
                              fill
                              src={getPredictionOutput(model, prediction)}
                              alt="output"
                              className="rounded-xl"
                            />
                          </div>

                          <div className="transition duration-200 absolute inset-0 bg-white bg-opacity-90 opacity-0 hover:opacity-100">
                            <div className="absolute z-50 group-hover:block top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                              <a
                                href={getPredictionOutput(model, prediction)}
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

                      {!prediction.output && (
                        <div className="border border-gray-300 py-3 text-sm opacity-50 flex items-center justify-center aspect-square rounded-lg">
                          <p className="mr-1">{prediction.status}</p>{" "}
                          <Counter />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Checkboxes */}
        <div className="col-span-2 h-screen">
          <div className="h-28 text-xs"></div>
          <div>
            <h5 className="text-lg text-gray-800">Text to Image</h5>
            <div className="mt-4 grid space-y-1">
              {models.map((model) => (
                <div key={model.id} className="relative flex items-start">
                  <div className="flex h-7 items-center">
                    <input
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      type="checkbox"
                      id={`model_input_${model.id}`}
                      value={model.id}
                      checked={model.checked}
                      onChange={handleCheckboxChange}
                    />
                  </div>
                  <div className="ml-3 text-sm leading-6">
                    <label
                      for={`model_input_${model.id}`}
                      className={
                        model.checked ? "text-gray-900" : "text-gray-500"
                      }
                    >
                      {model.name}
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
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
      <p>{(tenthSeconds / 10).toFixed(1)}s</p>
    </div>
  );
};

export function EmptyState() {
  return (
    <div className="text-center mt-16">
      <img
        alt="confused robot"
        className="mx-auto rounded-lg"
        src="./confused_bot.png"
      />
      <h3 className="mt-12 text-sm font-semibold text-gray-900">
        No model selected!
      </h3>
      <p className="mt-1 text-sm text-gray-500">Select a model on the right.</p>
    </div>
  );
}
