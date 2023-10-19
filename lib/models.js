// the ordering of these matters, it determines the order in the UI
const MODELS = [
  {
    id: 31,
    owner: "stability-ai",
    name: "SDXL",
    default_params: {
      width: 1024,
      height: 1024,
      scheduler: "K_EULER",
    },
    version: "98d6bab2dd21e4ffc4cc626420ab4f24b99ec60728c5d835ff9c3439396aca45",
    checked: true,
    source: "replicate",
    url: "https://replicate.com/stability-ai/sdxl?utm_source=project&utm_campaign=zoo",
    description:
      "A text-to-image generative AI model that creates beautiful 1024x1024 images",
    links: [
      {
        name: "replicate",
        url: "https://replicate.com/stability-ai/sdxl?utm_source=project&utm_campaign=zoo",
      },
      {
        name: "github",
        url: "https://github.com/Stability-AI/generative-models",
      },
    ],
  },
  {
    id: 33,
    owner: "luosiallen",
    name: "latent-consistency-model",
    default_params: {
      width: 512,
      height: 512,
      num_inference_steps: 4,
    },
    checked: true,
    version: "553803fd018b3cf875a8bc774c99da9b33f36647badfd88a6eec90d61c5f62fc",
    source: "replicate",
    url: "https://replicate.com/luosiallen/latent-consistency-model?utm_source=project&utm_campaign=zoo",
    description: "Synthesizing High-Resolution Images with Few-Step Inference",
    links: [
      {
        name: "replicate",
        url: "https://replicate.com/luosiallen/latent-consistency-model?utm_source=project&utm_campaign=zoo",
      },
      {
        name: "github",
        url: "https://github.com/luosiallen/latent-consistency-model",
      },
    ],
  },
  {
    id: 1,
    owner: "stability-ai",
    name: "stable-diffusion 2.1",
    default_params: {
      image_dimensions: "512x512",
    },
    version: "db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf",
    checked: true,
    source: "replicate",
    url: "https://replicate.com/stability-ai/stable-diffusion?utm_source=project&utm_campaign=zoo",
    description:
      "A latent text-to-image diffusion model capable of generating photo-realistic images given any text input",
    links: [
      {
        name: "replicate",
        url: "https://replicate.com/stability-ai/stable-diffusion?utm_source=project&utm_campaign=zoo",
      },
      {
        name: "github",
        url: "https://github.com/replicate/cog-stable-diffusion?utm_source=project&utm_campaign=zoo",
      },
    ],
  },
  {
    id: 3,
    owner: "stability-ai",
    name: "stable-diffusion 1.5",
    default_params: {
      image_dimensions: "512x512",
    },
    version: "328bd9692d29d6781034e3acab8cf3fcb122161e6f5afb896a4ca9fd57090577",
    checked: true,
    source: "replicate",
    url: "https://replicate.com/stability-ai/stable-diffusion?utm_source=project&utm_campaign=zoo",
    description:
      "A latent text-to-image diffusion model capable of generating photo-realistic images given any text input",
    links: [
      {
        name: "replicate",
        url: "https://replicate.com/stability-ai/stable-diffusion?utm_source=project&utm_campaign=zoo",
      },
      {
        name: "github",
        url: "https://github.com/replicate/cog-stable-diffusion?utm_source=project&utm_campaign=zoo",
      },
    ],
  },

  {
    id: 32,
    owner: "ai-forever",
    name: "kandinsky-2.2",
    default_params: {
      height: 1024,
      width: 1024,
    },
    version: "ea1addaab376f4dc227f5368bbd8eff901820fd1cc14ed8cad63b29249e9d463",
    checked: true,
    description: "multilingual text2image latent diffusion model",
    url: "https://replicate.com/ai-forever/kandinsky-2.2?utm_source=project&utm_campaign=zoo",
    links: [
      {
        name: "replicate",
        url: "https://replicate.com/ai-forever/kandinsky-2.2?utm_source=project&utm_campaign=zoo",
      },
      {
        name: "github",
        url: "https://github.com/chenxwh/Kandinsky-2.2?utm_source=project&utm_campaign=zoo",
      },
    ],
    source: "replicate",
  },
  {
    id: 4,
    owner: "ai-forever",
    name: "kandinsky-2",
    default_params: {
      image_dimensions: "512x512",
    },
    version: "601eea49d49003e6ea75a11527209c4f510a93e2112c969d548fbb45b9c4f19f",
    checked: true,
    description:
      "text2img model trained on LAION HighRes and fine-tuned on internal datasets",
    url: "https://replicate.com/ai-forever/kandinsky-2?utm_source=project&utm_campaign=zoo",
    links: [
      {
        name: "replicate",
        url: "https://replicate.com/ai-forever/kandinsky-2?utm_source=project&utm_campaign=zoo",
      },
      {
        name: "github",
        url: "https://github.com/chenxwh/Kandinsky-2?utm_source=project&utm_campaign=zoo",
      },
    ],
    source: "replicate",
  },
  {
    id: 6,
    owner: "OpenAI",
    name: "DALL-E 2",
    version: "dall-e",
    checked: false,
    default_params: {
      n: 1,
      size: "512x512",
    },
    description:
      "DALL·E 2 is an AI system that can create realistic images and art from a description in natural language.",
    url: "https://openai.com/product/dall-e-2?utm_source=project&utm_campaign=zoo",
    links: [
      {
        name: "openai",
        url: "https://openai.com/product/dall-e-2?utm_source=project&utm_campaign=zoo",
      },
    ],
    source: "openai",
  },
  {
    id: 10,
    owner: "replicate",
    name: "deepfloyd-if",
    version: "fb84d659df149f4515c351e394d22222a94144aa1403870c36025c8b28846c8d",
    checked: false,
    description:
      "The DeepFloyd IF model has been initially released as a non-commercial research-only model. Please make sure you read and abide to the license before using it.",
    url: "https://replicate.com/replicate/deepfloyd-if?utm_source=project&utm_campaign=zoo",
    source: "replicate",
    links: [
      {
        name: "replicate",
        url: "https://replicate.com/replicate/deepfloyd-if?utm_source=project&utm_campaign=zoo",
      },
      {
        name: "github",
        url: "https://github.com/replicate/cog-deepfloyd-if?utm_source=project&utm_campaign=zoo",
      },
    ],
  },
  {
    id: 5,
    owner: "tstramer",
    name: "material-diffusion",
    default_params: {
      image_dimensions: "512x512",
    },
    version: "a42692c54c0f407f803a0a8a9066160976baedb77c91171a01730f9b0d7beeff",
    checked: false,
    description:
      "Stable diffusion fork for generating tileable outputs using v1.5 model",
    url: "https://replicate.com/tstramer/material-diffusion?utm_source=project&utm_campaign=zoo",
    links: [
      {
        name: "replicate",
        url: "https://replicate.com/tstramer/material-diffusion?utm_source=project&utm_campaign=zoo",
      },
    ],
    source: "replicate",
  },
];

export default MODELS;
