// the ordering of these matters, it determines the order in the UI
const model = {
  owner: "jagilley",
  checked: true,
  url: `https://replicate.com/jagilley/controlnet?utm_source=project&utm_campaign=zoo`,
  links: [],
}

const CONTROLNET_MODELS = [
  {
    ...model,
    id: 1,
    name: "Canny",
    version: "aff48af9c68d162388d230a2ab003f68d2638d88307bdaf1c2f1ac95079c9613",
    description: "Canny description",
  },
  {
    ...model,
    id: 2,
    name: "Depth",
    version: "922c7bb67b87ec32cbc2fd11b1d5f94f0ba4f5519c4dbd02856376444127cc60",
    description: "Description",
  },
  {
    ...model,
    id: 3,
    name: "HED",
    version: "cde353130c86f37d0af4060cd757ab3009cac68eb58df216768f907f0d0a0653",
    description: "Description",
  },
  {
    ...model,
    id: 4,
    name: "Normal",
    version: "cc8066f617b6c99fdb134bc1195c5291cf2610875da4985a39de50ee1f46d81c",
    description: "Description",
  },
  {
    ...model,
    id: 5,
    name: "MLSD",
    version: "854e8727697a057c525cdb45ab037f64ecca770a1769cc52287c2e56472a247b",
    description: "Description",
  },
  {
    ...model,
    id: 6,
    name: "Scribble",
    version: "435061a1b5a4c1e26740464bf786efdfa9cb3a3ac488595a2de23e143fdb0117",
    description: "Description",
  },
  {
    ...model,
    id: 7,
    name: "Segmentation",
    version: "f967b165f4cd2e151d11e7450a8214e5d22ad2007f042f2f891ca3981dbfba0d",
    description: "Description",
  },
  {
    ...model,
    id: 8,
    name: "Openpose",
    version: "0304f7f774ba7341ef754231f794b1ba3d129e3c46af3022241325ae0c50fb99",
    description: "Description",
  },
];

export default CONTROLNET_MODELS;
