// the ordering of these matters, it determines the order in the UI
const MODELS = [
  {
    id: 30,
    owner: "stability-ai",
    name: "stable-diffusion XL",
    version: "stability",
    checked: true,
    source: "stability",
    url: "https://stability.ai/blog/stable-diffusion-xl-beta-available-for-api-customers-and-dreamstudio-users?utm_source=project&utm_campaign=zoo",
    description:
      "A latent text-to-image diffusion model capable of generating photo-realistic images given any text input",
    links: [],
  },
  {
    id: 1,
    owner: "stability-ai",
    name: "stable-diffusion 2.1",
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
    id: 6,
    owner: "OpenAI",
    name: "DALL-E",
    version: "dall-e",
    checked: true,
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
    id: 4,
    owner: "ai-forever",
    name: "kandinsky-2",
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
