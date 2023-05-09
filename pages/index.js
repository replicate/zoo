import { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import promptmaker from "promptmaker";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function Home() {
  const [prompt, setPrompt] = useState(promptmaker());
  const [predictions, setPredictions] = useState([]);
  const [error, setError] = useState(null);

  const models = [
    {
      id: 3,
      name: "stability-ai/stable-diffusion 1.5",
      version:
        "328bd9692d29d6781034e3acab8cf3fcb122161e6f5afb896a4ca9fd57090577",
    },
    {
      id: 1,
      name: "stability-ai/stable-diffusion 2.1",
      version:
        "db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf",
    },
    {
      id: 2,
      name: "ai-forever/kandinsky-2",
      version:
        "601eea49d49003e6ea75a11527209c4f510a93e2112c969d548fbb45b9c4f19f",
    },
    {
      id: 4,
      name: "tstramer/material-diffusion",
      version:
        "a42692c54c0f407f803a0a8a9066160976baedb77c91171a01730f9b0d7beeff",
    },
  ];

  const [selectedModels, setSelectedModels] = useState([]);

  function getModelByVersion(version) {
    return models.find((m) => m.version === version);
  }

  const handleCheckboxChange = (e) => {
    const modelId = parseInt(e.target.value, 10);
    const model = models.find((m) => m.id === modelId);

    if (e.target.checked) {
      const newModels = [...selectedModels, model];
      setSelectedModels(newModels);
    } else {
      setSelectedModels((prev) => prev.filter((item) => item !== model));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    for (const model of selectedModels) {
      // Use the model variable to generate predictions with the selected model
      // Update the API call or any other logic as needed to use the selected model

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
            prev.map((item) => (item.id === prediction.id ? prediction : item))
          );
        }
      };

      updatePrediction();
    }
  };

  return (
    <div className="container max-w-2xl mx-auto p-5">
      <Head>
        <title>Replicate + Next.js</title>
      </Head>

      <h1 className="py-6 text-center font-bold text-2xl">Cat.Dev</h1>

      <form className="w-full" onSubmit={handleSubmit}>
        <div className="">
          <textarea
            name="prompt"
            className="w-full border-2"
            rows="3"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter a prompt to display an image"
          />

          <div className="text-right">
            <button className="button" type="submit">
              Go!
            </button>
          </div>

          <div className="">
            {models.map((model) => (
              <label key={model.id} className="block">
                <input
                  type="checkbox"
                  value={model.id}
                  checked="true"
                  onChange={handleCheckboxChange}
                />
                <span className="ml-2">{model.name}</span>
              </label>
            ))}
          </div>
        </div>
      </form>

      {error && <div>{error}</div>}

      <div className="grid grid-cols-3 gap-4">
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
  );
}
