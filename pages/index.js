import { useState, useEffect } from "react";
import Prediction from "../components/prediction";
import Head from "next/head";
import promptmaker from "promptmaker";
import Link from "next/link";
import MODELS from "../lib/models.js";
import { v4 as uuidv4 } from "uuid";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [predictions, setPredictions] = useState([]);
  const [error, setError] = useState(null);
  const [numOutputs, setNumOutputs] = useState(1);
  const [firstTime, setFirstTime] = useState(false);
  const [models, setModels] = useState([]);
  const [anonID, setAnonID] = useState(null);
  const [submissionID, setSubmissionID] = useState(null);

  function getSelectedModels() {
    return models.filter((m) => m.checked);
  }

  function getPredictionsByVersion(version) {
    console.log("getPredictionsByVersion", version);
    console.log(predictions.map((p) => p.version));
    return predictions.filter((p) => p.version === version);
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

    // save to local storage
    localStorage.setItem("models", JSON.stringify(updatedModels));
  };

  const onKeyDown = (e) => {
    if (e.metaKey && e.which === 13) {
      handleSubmit(e, prompt);
    }
  };

  async function createSubmission(id, predictions) {
    console.log("predictions", predictions);
    const response = await fetch("/api/submissions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
        predictionIDs: predictions.map((p) => p.id),
        prompt: prompt,
      }),
    });
    let submission = await response.json();
    console.log(submission);
  }

  async function createReplicatePrediction(prompt, model) {
    const response = await fetch("/api/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: prompt,
        version: model.version,
        source: model.source,
        model: model.name,
        anonID: anonID,
      }),
    });

    let prediction = await response.json();

    if (response.status !== 201) {
      throw new Error(prediction.detail);
    }

    while (
      prediction.status !== "succeeded" &&
      prediction.status !== "failed"
    ) {
      await sleep(500);
      const response = await fetch("/api/predictions/" + prediction.id);
      prediction = await response.json();
      console.log(prediction);
      if (response.status !== 200) {
        throw new Error(prediction.detail);
      }
    }

    prediction.model = model.name;
    prediction.source = model.source;

    return prediction;
  }

  async function createDallePrediction(prompt, model) {
    const predictionId = uuidv4();

    const response = await fetch("/api/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: prompt,
        version: model.version,
        source: model.source,
        model: model.name,
        predictionId: predictionId,
        anonID: anonID,
        created_at: new Date().toISOString(),
      }),
    });

    let prediction = await response.json();
    prediction.source = model.source;
    prediction.version = model.version;

    return prediction;
  }

  const handleSubmit = async (e, prompt) => {
    e.preventDefault();
    setError(null);
    setFirstTime(false);
    const submissionID = uuidv4();
    setSubmissionID(submissionID);

    // extract prediction creation to its own function

    for (const model of getSelectedModels()) {
      // Use the model variable to generate predictions with the selected model
      // Update the API call or any other logic as needed to use the selected model
      for (let i = 0; i < numOutputs; i++) {
        let promise = null;

        if (model.source == "replicate") {
          promise = createReplicatePrediction(prompt, model);
        } else if (model.source == "openai") {
          promise = createDallePrediction(prompt, model);
        }

        promise.model = model.name;
        promise.source = model.source;
        promise.version = model.version;

        setPredictions((prev) => [...prev, promise]);

        promise
          .then((result) => {
            setPredictions((prev) =>
              prev.map((x) => (x === promise ? result : x))
            );
          })
          .catch((error) => setError(error.message));
      }
    }

    createSubmission(submissionID, predictions);
  };

  function checkOrder(list1, list2) {
    // Check if both lists are of the same length
    if (list1.length !== list2.length) {
      return false;
    }

    // Check if names are in the same order
    for (let i = 0; i < list1.length; i++) {
      if (list1[i].name !== list2[i].name) {
        return false;
      }
    }

    // If we made it here, the names are in the same order
    return true;
  }

  useEffect(() => {
    const anonID = localStorage.getItem("anonID");
    const storedModels = localStorage.getItem("models");
    const prompt = promptmaker({ flavors: null });
    setPrompt(prompt);

    if (storedModels && checkOrder(JSON.parse(storedModels), MODELS)) {
      setModels(JSON.parse(storedModels));
    } else {
      setModels(MODELS);
      setFirstTime(true);
    }

    if (!anonID) {
      const uuid = uuidv4();
      localStorage.setItem("anonID", uuid);
      setAnonID(uuid);
    } else {
      console.log("returning user", anonID);
      setAnonID(anonID);
    }
  }, []);

  console.log(predictions);

  return (
    <div className="mx-auto container p-5">
      <Head>
        <title>Zoo</title>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%2210 0 100 100%22><text y=%22.90em%22 font-size=%2290%22>🦓</text></svg>"
        ></link>
        <meta property="og:image" content="/og.png" />
      </Head>

      <div className="pt-2">
        <div className="mx-0 max-w-7xl">
          <div className="mx-0 max-w-3xl">
            {firstTime && (
              <span className="text-2xl font-medium tracking-tight text-gray-500">
                Welcome to the Zoo, a playground for text to image models.{" "}
              </span>
            )}
            <span className="text-2xl font-medium tracking-tight text-gray-900">
              What do you want to see?
            </span>
          </div>
        </div>
      </div>

      <div className="md:grid grid-cols-12 gap-x-16 mt-2">
        {/* Form + Outputs */}

        <div className="col-span-10 h-full">
          <div className="h-24">
            <form
              onKeyDown={onKeyDown}
              className="w-full"
              onSubmit={(e) => handleSubmit(e, prompt)}
            >
              <div className="flex relative mt-2">
                {" "}
                <div className="w-full h-full relative">
                  <textarea
                    name="prompt"
                    className="w-full border-2 p-3 pr-12 text-sm md:text-base rounded-md ring-brand outline-brand"
                    rows="2"
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
                    className="button bg-brand h-full flex justify-center items-center font-bold hover:bg-orange-600"
                    type="submit"
                  >
                    Go{" "}
                  </button>
                  {submissionID && (
                    <Link
                      href={`/memories/${submissionID}`}
                      className="ml-3 button bg-brand h-full flex justify-center items-center font-bold hover:bg-orange-600"
                      type="submit"
                    >
                      Share
                    </Link>
                  )}
                </div>
              </div>
            </form>
          </div>

          {!firstTime && (
            <div className="">
              {getSelectedModels().length == 0 && <EmptyState />}

              {getSelectedModels().map((model) => (
                <div key={model.id} className="mt-5">
                  <div className="flex gap-6 tracking-wide mb-10">
                    {/* Model description */}
                    <div className="w-72 border-l-4 border-gray-900 pl-5 md:pl-6 py-2">
                      <Link
                        href={`https://replicate.com/${model.owner.toLowerCase()}?utm_source=project&utm_campaign=zoo`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <h5 className="text-xs md:text-sm text-gray-500 hover:text-gray-900">
                          {model.owner}
                        </h5>
                      </Link>
                      <Link
                        href={model.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <h5 className="text-base md:text-xl font-medium text-gray-800 hover:text-gray-500">
                          {model.name}
                        </h5>
                      </Link>
                      <p className="text-xs md:text-sm text-gray-500 mt-2 md:mt-4">
                        {model.description}
                      </p>

                      <div className="mt-2 -ml-1 md:mt-6 flex">
                        {model.links != null &&
                          model.links.map((link) => (
                            <a key={`${model.id}-${link.url}`} href={link.url}>
                              <img
                                src={`/${link.name}.png`}
                                alt={link.name}
                                className={
                                  model.source == "openai"
                                    ? "h-4 w-4"
                                    : "h-6 w-6"
                                }
                              />
                            </a>
                          ))}
                      </div>
                    </div>

                    {/* Row for predictions */}
                    <div className="flex w-full overflow-x-auto space-x-6">
                      {getPredictionsByVersion(model.version)
                        .reverse()
                        .map((prediction) => (
                          <Prediction
                            key={prediction.id}
                            prediction={prediction}
                          />
                        ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <Checkboxes
          models={models}
          handleCheckboxChange={handleCheckboxChange}
          className={"mt-28"}
        />
      </div>
    </div>
  );
}

const Checkboxes = ({ models, handleCheckboxChange, className }) => {
  return (
    <div className={`col-span-2 mb-28 ${className}`}>
      <div>
        <h5 className="text-lg text-gray-800 font-bold">Models</h5>
        <div className="mt-4 grid space-y-1">
          {models.map((model) => (
            <div key={model.id} className="relative flex items-start">
              <div className="flex h-7 items-center">
                <input
                  className="h-4 w-4 rounded accent-brand border-gray-300 focus:ring-indigo-600"
                  type="checkbox"
                  id={`model_input_${model.id}`}
                  value={model.id}
                  checked={model.checked}
                  onChange={handleCheckboxChange}
                />
              </div>
              <div className="ml-3 text-xs md:text-sm leading-6">
                <label
                  htmlFor={`model_input_${model.id}`}
                  className={model.checked ? "text-gray-900" : "text-gray-500"}
                >
                  {model.name}
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>
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
        No memories yet!
      </h3>
      <p className="mt-1 text-sm text-gray-500">Create some images first.</p>
    </div>
  );
}
