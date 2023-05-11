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
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const [models, setModels] = useState([]);

  function getSelectedModels() {
    return models.filter((m) => m.checked);
  }

  function getPredictionsByVersion(version) {
    return predictions.filter((p) => p.version === version);
  }

  function getPredictionOutput(prediction) {
    return prediction.output[prediction.output.length - 1];
  }

  const clearHistory = () => {
    localStorage.removeItem("predictions");
    setHistory([]);
  };

  const handleNewPrediction = (newPrediction) => {
    // Get the current list of predictions from localStorage
    let predictionHistory = localStorage.getItem("predictions");

    // If there are already predictions saved, parse the saved list to a JavaScript array.
    // If not, start with an empty array.
    predictionHistory = predictionHistory ? JSON.parse(predictionHistory) : [];

    // Add the new prediction to the list
    predictionHistory.push(newPrediction);

    // Save the updated list back to localStorage
    localStorage.setItem("predictions", JSON.stringify(predictionHistory));
  };

  const handleClearHistory = (e) => {
    if (window.confirm("Do you really want to clear your Zoo history?")) {
      clearHistory();
    }
  };

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

    // save to local storage
    localStorage.setItem("models", JSON.stringify(updatedModels));
  };

  const onKeyDown = (e) => {
    if (e.metaKey && e.which === 13) {
      handleSubmit(e, prompt);
    }
  };

  const handleSubmit = async (e, prompt) => {
    e.preventDefault();
    setError(null);

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
              prompt: prompt,
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
              prediction.model = model.name;
              setPredictions((prev) =>
                prev.map((item) =>
                  item.id === prediction.id ? prediction : item
                )
              );
            }
            handleNewPrediction(prediction);
          } else if (model.source == "openai") {
            const response = await fetch("/api/predictions", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                prompt: prompt,
                version: model.version,
                source: model.source,
                predictionId: predictionId,
              }),
            });

            let prediction = await response.json();
            prediction.model = model.name;
            setPredictions((prev) =>
              prev.map((item) =>
                item.id === prediction.id ? prediction : item
              )
            );
            // save to local storage
            handleNewPrediction(prediction);
          }
        };

        updatePrediction();
      }
    }
  };

  useEffect(() => {
    const storedModels = localStorage.getItem("models");
    const storedPredictions = localStorage.getItem("predictions");

    if (storedModels) {
      setModels(JSON.parse(storedModels));
    } else {
      setModels(MODELS);
    }

    if (storedPredictions) {
      setHistory(JSON.parse(storedPredictions));
    } else {
      setHistory([]);
    }
  }, []);

  return (
    <div className="mx-auto container p-5">
      <Head>
        <title>Zoo</title>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%2210 0 100 100%22><text y=%22.90em%22 font-size=%2290%22>🦓</text></svg>"
        ></link>
      </Head>

      <nav>
        <div className="sm:flex">
          <div className="mb-4 flex-shrink-0 sm:mb-0 sm:mr-4">
            <span className="text-4xl">🦓</span>
          </div>
          <div className="flex w-full justify-between">
            <div class="flex">
              <h4 className="text-lg items-center flex font-bold justify-center">
                Zoo{" "}
                <span className="text-zinc-500 ml-1 font-light">
                  Image Playground
                </span>
              </h4>
            </div>
            <div className="">
              {showHistory ? (
                <>
                  <button
                    onClick={() => handleClearHistory()}
                    type="button"
                    data-confirm="Are you sure you want to delete your Zoo history?"
                    className="mr-4 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-red-500 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  >
                    Clear Memories
                  </button>
                  <button
                    onClick={() => setShowHistory(false)}
                    type="button"
                    className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  >
                    &larr; Back
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowHistory(true)}
                  type="button"
                  className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  Memories
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {!showHistory ? (
        <div className="grid grid-cols-12 gap-x-16 mt-12">
          {/* Form + Outputs */}
          <div className="col-span-10 h-full">
            <div className="h-24">
              <form
                onKeyDown={onKeyDown}
                className="w-full"
                onSubmit={(e) => handleSubmit(e, prompt)}
              >
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
                      className="absolute right-3.5 top-2 text-gray-500 hover:text-gray-900 px-1 py-2 rounded-md flex justify-center items-center"
                      type="button"
                      onClick={() => setPrompt(promptmaker())}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
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
                    <button
                      className="button h-full font-bold hover:bg-slate-800"
                      type="submit"
                    >
                      Go
                    </button>
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
                            <a key={uuidv4()} href={link.url}>
                              <img
                                src={`/${link.name}.png`}
                                alt={link.name}
                                className={
                                  model.source == "openai"
                                    ? "h45 w-4"
                                    : "h-6 w-6"
                                }
                              />
                            </a>
                          ))}
                      </div>
                    </div>
                    {getPredictionsByVersion(model.version).map(
                      (prediction) => (
                        <div className="group relative" key={prediction.id}>
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

                          {!prediction.output && (
                            <div className="border border-gray-300 py-3 text-sm opacity-50 flex items-center justify-center aspect-square rounded-lg">
                              <p className="mr-1">{prediction.status}</p>{" "}
                              <Counter />
                            </div>
                          )}
                        </div>
                      )
                    )}
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
                        htmlFor={`model_input_${model.id}`}
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
      ) : (
        <>
          <div className="mt-12 md:flex md:items-center md:justify-between">
            <div className="min-w-0 flex-1">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                Memories at the Zoo
              </h2>
            </div>
          </div>

          {history.length == 0 && <EmptyStateHistory />}

          <ul
            role="list"
            className="mt-12 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8"
          >
            {history.reverse().map((prediction) => (
              <li key={prediction.id} className="relative">
                <div className="group aspect-h-7 aspect-w-10 block w-full overflow-hidden rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100">
                  <img
                    src={getPredictionOutput(prediction)}
                    alt=""
                    className="pointer-events-none object-cover group-hover:opacity-75"
                  />
                  <a
                    href={getPredictionOutput(prediction)}
                    className="absolute inset-0 focus:outline-none"
                    download={`${prediction.id}.png`}
                  />
                </div>
                <p className="pointer-events-none mt-2 block truncate text-sm font-medium text-gray-900">
                  {prediction.model}
                </p>
                <p className="pointer-events-none block text-sm font-medium text-gray-500">
                  {prediction.input.prompt}
                </p>
              </li>
            ))}
          </ul>
        </>
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
export function EmptyStateHistory() {
  return (
    <div className="text-center mt-16">
      <img
        alt="confused robot"
        className="mx-auto rounded-lg"
        src="./confused_bot.png"
      />
      <h3 className="mt-12 text-sm font-semibold text-gray-900">
        No history yet!
      </h3>
      <p className="mt-1 text-sm text-gray-500">Create some images first!</p>
    </div>
  );
}
