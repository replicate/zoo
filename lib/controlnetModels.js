// the ordering of these matters, it determines the order in the UI
const utm = "?utm_source=project&utm_campaign=zoo";
const CONTROLNET_MODELS = [
  {
    id: 1,
    owner: "jagilley",
    name: "Scribble",
    version: "435061a1b5a4c1e26740464bf786efdfa9cb3a3ac488595a2de23e143fdb0117",
    checked: true,
    source: "replicate",
    url: `https://replicate.com/jagilley/controlnet-scribble?${utm}`,
    description: "",
    links: [],
  },
  {
    id: 2,
    owner: "jagilley",
    name: "Pose",
    version: "0304f7f774ba7341ef754231f794b1ba3d129e3c46af3022241325ae0c50fb99",
    checked: true,
    source: "replicate",
    url: `https://replicate.com/jagilley/controlnet-pose?${utm}`,
    description: "",
    links: [],
  },
];

export default CONTROLNET_MODELS;
