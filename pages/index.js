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
    },
    {
      id: 4,
      owner: "tstramer",
      name: "material-diffusion",
      version:
        "a42692c54c0f407f803a0a8a9066160976baedb77c91171a01730f9b0d7beeff",
      checked: true,
      description:
        "Stable diffusion fork for generating tileable outputs using v1.5 model",
      replicate_link: "https://replicate.com/tstramer/material-diffusion",
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
        <title>Zeke</title>
      </Head>

      <nav>
        <div class="sm:flex">
          <div class="mb-4 flex-shrink-0 sm:mb-0 sm:mr-4">
            <img
              src="https://github-production-user-asset-6210df.s3.amazonaws.com/14149230/237235028-5818ffa6-af8a-4c1a-9644-1ddcceac008e.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAIWNJYAX4CSVEH53A/20230509/us-east-1/s3/aws4_request&X-Amz-Date=20230509T223509Z&X-Amz-Expires=300&X-Amz-Signature=64eec013b9782cc731583552ee9739ec5a12e6f25f7ede44fe015e5462eb6995&X-Amz-SignedHeaders=host&actor_id=14149230&key_id=0&repo_id=601830749"
              alt=""
              className="h-12 w-12 inline-flex"
            />
          </div>
          <div class="flex">
            <h4 class="text-lg items-center flex justify-center">
              Replicate <span class="text-zinc-500 ml-1">Playground</span>
            </h4>
          </div>
        </div>
      </nav>

      <div className="grid grid-cols-12 gap-x-16 mt-12">
        {/* Form + Outputs */}
        <div className="col-span-9 h-full">
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

          {getSelectedModels().map((model) => (
            <div key={model.id} className="mt-5">
              <div className="grid grid-cols-4 gap-6 tracking-wide">
                <div class="border-l-4 border-gray-900 pl-6 py-2 mb-10">
                  <h5 class="text-sm text-gray-500">{model.owner}</h5>
                  <h5 class="text-xl font-medium text-gray-800">
                    {model.name}
                  </h5>
                  <p class="text-sm  text-gray-500 mt-4">{model.description}</p>

                  <div className="mt-6">
                    <a href={model.replicate_link}>
                      <img
                        src="https://github-production-user-asset-6210df.s3.amazonaws.com/14149230/237239375-cc337cae-5a36-4857-ae6e-7f0b73d861f8.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAIWNJYAX4CSVEH53A%2F20230509%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20230509T230912Z&X-Amz-Expires=300&X-Amz-Signature=2181102531e342069cb5aaf89b4bf47f37ee09ceb7df18ca111311315a0b90ff&X-Amz-SignedHeaders=host&actor_id=14149230&key_id=0&repo_id=622710084"
                        alt=""
                        className="h-6 w-6 "
                      />
                    </a>
                  </div>
                </div>
                {getPredictionsByVersion(model.version).map((prediction) => (
                  <div key={prediction.id}>
                    {prediction.output && (
                      <div className="image-wrapper rounded-lg">
                        <Image
                          fill
                          src={prediction.output[prediction.output.length - 1]}
                          alt="output"
                          className="p-5"
                        />
                      </div>
                    )}

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

          <div className="hidden grid grid-cols-3 gap-4">
            {predictions.map((prediction) => (
              <div key={prediction.id}>
                {prediction.output && (
                  <div className="image-wrapper mt-5">
                    <Image
                      fill
                      src={prediction.output[prediction.output.length - 1]}
                      alt="output"
                      sizes="100vw"
                    />
                  </div>
                )}

                <p className="py-3 text-sm opacity-50">
                  {prediction.status === "succeeded"
                    ? getModelByVersion(prediction.version).name
                    : prediction.status}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Checkboxes */}
        <div className="col-span-3 h-screen">
          <div className="h-28 text-xs"></div>
          <div>
            <h5 class="text-lg text-gray-800">Text to Image</h5>
            <div className="mt-4 grid space-y-2">
              {models.map((model) => (
                <div key={model.id} class="relative flex items-start">
                  <div class="flex h-6 items-center">
                    <input
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      type="checkbox"
                      value={model.id}
                      checked={model.checked}
                      onChange={handleCheckboxChange}
                    />
                  </div>
                  <div class="ml-3 text-sm leading-6">
                    {model.checked ? (
                      <label for="model" class="font-medium text-gray-900">
                        {model.name}
                      </label>
                    ) : (
                      <label for="model" class="font-medium text-gray-500">
                        {model.name}
                      </label>
                    )}
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
