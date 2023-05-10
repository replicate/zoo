import { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import promptmaker from "promptmaker";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function Home() {
  const [prompt, setPrompt] = useState(promptmaker());
  const [predictions, setPredictions] = useState([]);
  const [error, setError] = useState(null);
  const [numOutputs, setNumOutputs] = useState(3);

  const [models, setModels] = useState([
    {
      id: 3,
      owner: "stability-ai",
      name: "stable-diffusion 1.5",
      version:
        "328bd9692d29d6781034e3acab8cf3fcb122161e6f5afb896a4ca9fd57090577",
      checked: true,
      description:
        "A latent text-to-image diffusion model capable of generating photo-realistic images given any text input",
      replicate_link: "https://replicate.com/stability-ai/stable-diffusion",
      github_link: "https://github.com/replicate/cog-stable-diffusion",
    },
    {
      id: 1,
      owner: "stability-ai",
      name: "stable-diffusion 2.1",
      version:
        "db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf",
      checked: true,
      description:
        "A latent text-to-image diffusion model capable of generating photo-realistic images given any text input",
      replicate_link: "https://replicate.com/stability-ai/stable-diffusion",
      github_link: "https://github.com/replicate/cog-stable-diffusion",
    },
    {
      id: 2,
      owner: "ai-forever",
      name: "kandinsky-2",
      version:
        "601eea49d49003e6ea75a11527209c4f510a93e2112c969d548fbb45b9c4f19f",
      checked: true,
      description:
        "text2img model trained on LAION HighRes and fine-tuned on internal datasets",
      replicate_link: "https://replicate.com/ai-forever/kandinsky-2",
      github_link: "https://github.com/chenxwh/Kandinsky-2",
    },
    {
      id: 4,
      owner: "tstramer",
      name: "material-diffusion",
      version:
        "a42692c54c0f407f803a0a8a9066160976baedb77c91171a01730f9b0d7beeff",
      checked: false,
      description:
        "Stable diffusion fork for generating tileable outputs using v1.5 model",
      replicate_link: "https://replicate.com/tstramer/material-diffusion",
      github_link: "https://replicate.com/tstramer/material-diffusion",
    },
    {
      id: 5,
      owner: "prompthero",
      name: "openjourney-v4",
      version:
        "e8818682e72a8b25895c7d90e889b712b6edfc5151f145e3606f21c1e85c65bf",
      checked: true,
      description: "SD 1.5 trained with +124k MJv4 images by PromptHero",
      replicate_link: "https://replicate.com/prompthero/openjourney-v4",
      github_link: "https://replicate.com/prompthero/openjourney-v4",
    },
  ]);

  function getModelByVersion(version) {
    return models.find((m) => m.version === version);
  }

  function getSelectedModels() {
    return models.filter((m) => m.checked);
  }

  function getPredictionsByVersion(version) {
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    for (const model of getSelectedModels()) {
      // Use the model variable to generate predictions with the selected model
      // Update the API call or any other logic as needed to use the selected model
      for (let i = 0; i < numOutputs; i++) {
        const response = await fetch("/api/predictions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: e.target.prompt.value,
            version: model.version,
          }),
        });
        let prediction = await response.json();
        if (response.status !== 201) {
          setError(prediction.detail);
          return;
        }
        setPredictions((prev) => [...prev, prediction]);

        const updatePrediction = async () => {
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
            console.log({ prediction });
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
            <img
              src="/replicate-black.png"
              alt=""
              className="h-12 w-12 inline-flex"
            />
          </div>
          <div className="flex">
            <h4 className="text-lg items-center flex justify-center">
              Replicate <span className="text-zinc-500 ml-1">Playground</span>
            </h4>
          </div>
        </div>
      </nav>

      <div className="grid grid-cols-12 gap-x-16 mt-12">
        {/* Form + Outputs */}
        <div className="col-span-10 h-full">
          <div className="h-24">
            <form className="w-full" onSubmit={handleSubmit}>
              <div className="flex">
                <textarea
                  name="prompt"
                  className="w-full border-2 p-3 rounded-md"
                  rows="1"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Enter a prompt to display an image"
                />

                <div className="ml-3">
                  {predictions.length == 0 ? (
                    <button
                      className="button h-full font-bold hover:bg-slate-800"
                      type="submit"
                    >
                      Go
                    </button>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </form>
          </div>

          <div>
            {getSelectedModels().map((model) => (
              <div key={model.id} className="mt-5">
                <div className="grid grid-cols-4 gap-6 tracking-wide">
                  <div className="border-l-4 border-gray-900 pl-6 py-2 mb-10">
                    <h5 className="text-sm text-gray-500">{model.owner}</h5>
                    <h5 className="text-xl font-medium text-gray-800">
                      {model.name}
                    </h5>
                    <p className="text-sm  text-gray-500 mt-4">
                      {model.description}
                    </p>

                    <div className="mt-6 flex">
                      <a href={model.replicate_link}>
                        <img
                          src="/replicate.png"
                          alt="Replicate"
                          className="h-6 w-6 "
                        />
                      </a>
                      <a href={model.github_link}>
                        <img
                          src="/github.png"
                          alt="GitHub"
                          className="h-6 w-6 bg-white ml-2"
                        />
                      </a>
                    </div>
                  </div>
                  {getPredictionsByVersion(model.version).map((prediction) => (
                    <div className="group relative" key={prediction.id}>
                      {prediction.output && (
                        <div className="image-wrapper rounded-lg">
                          <Image
                            fill
                            src={
                              prediction.output[prediction.output.length - 1]
                            }
                            alt="output"
                            className=""
                          />
                        </div>
                      )}

                      <div className="hidden absolute group-hover:block inset-0 bg-white bg-opacity-80"></div>

                      <div className="hidden absolute z-50 group-hover:block top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -mt-3">
                        <a
                          href={`https://replicate.com/p/${prediction.id}`}
                          className=""
                          target="_blank"
                          rel="noreferrer"
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

                      <p className="py-3 text-sm opacity-50 flex items-center justify-center">
                        {prediction.status === "succeeded"
                          ? ""
                          : prediction.status}
                      </p>
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
