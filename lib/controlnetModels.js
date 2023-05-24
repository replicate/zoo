// the ordering of these matters, it determines the order in the UI
const utm = "?utm_source=project&utm_campaign=zoo"
const model = {
  owner: "jagilley",
  checked: true,
}

const CONTROLNET_MODELS = [
  {
    ...model,
    id: 1,
    name: "Canny",
    version: "aff48af9c68d162388d230a2ab003f68d2638d88307bdaf1c2f1ac95079c9613",
    description: "Modify images using canny edge detection",
    url: `https://replicate.com/jagilley/controlnet-canny${utm}`,
    links: [
      {
        name: "replicate",
        url: `https://replicate.com/jagilley/controlnet-canny${utm}`,
      }
    ]
  },
  {
    ...model,
    id: 2,
    name: "Depth",
    version: "922c7bb67b87ec32cbc2fd11b1d5f94f0ba4f5519c4dbd02856376444127cc60",
    description: "Modify images using depth maps",
    url: `https://replicate.com/jagilley/controlnet-depth2img${utm}`,
    links: [
      {
        name: "replicate",
        url: `https://replicate.com/jagilley/controlnet-depth2img${utm}`,
      }
    ]
  },
  {
    ...model,
    id: 3,
    name: "HED",
    version: "cde353130c86f37d0af4060cd757ab3009cac68eb58df216768f907f0d0a0653",
    description: "Modify images using soft edge detection",
    url: `https://replicate.com/jagilley/controlnet-hed${utm}`,
    links: [
      {
        name: "replicate",
        url: `https://replicate.com/jagilley/controlnet-hed${utm}`,
      }
    ]
  },
  {
    ...model,
    id: 4,
    name: "Normal",
    version: "cc8066f617b6c99fdb134bc1195c5291cf2610875da4985a39de50ee1f46d81c",
    description: "Modify images using normal maps",
    url: `https://replicate.com/jagilley/controlnet-normal${utm}`,
    links: [
      {
        name: "replicate",
        url: `https://replicate.com/jagilley/controlnet-normal${utm}`,
      }
    ]
  },
  {
    ...model,
    id: 5,
    name: "MLSD",
    version: "854e8727697a057c525cdb45ab037f64ecca770a1769cc52287c2e56472a247b",
    description: "Modify images using straight line detection",
    url: `https://replicate.com/jagilley/controlnet-hough${utm}`,
    links: [
      {
        name: "replicate",
        url: `https://replicate.com/jagilley/controlnet-hough${utm}`,
      }
    ]
  },
  {
    ...model,
    id: 6,
    name: "Scribble",
    version: "435061a1b5a4c1e26740464bf786efdfa9cb3a3ac488595a2de23e143fdb0117",
    description: "Generate detailed images from scribbled drawings",
    url: `https://replicate.com/jagilley/controlnet-scribble${utm}`,
    links: [
      {
        name: "replicate",
        url: `https://replicate.com/jagilley/controlnet-scribble${utm}`,
      }
    ]
  },
  {
    ...model,
    id: 7,
    name: "Segmentation",
    version: "f967b165f4cd2e151d11e7450a8214e5d22ad2007f042f2f891ca3981dbfba0d",
    description: "Modify images using semantic segmentation",
    url: `https://replicate.com/jagilley/controlnet-seg${utm}`,
    links: [
      {
        name: "replicate",
        url: `https://replicate.com/jagilley/controlnet-seg${utm}`,
      }
    ]
  },
  {
    ...model,
    id: 8,
    name: "Openpose",
    version: "0304f7f774ba7341ef754231f794b1ba3d129e3c46af3022241325ae0c50fb99",
    description: "Modify images with people using pose detection",
    url: `https://replicate.com/jagilley/controlnet-pose${utm}`,
    links: [
      {
        name: "replicate",
        url: `https://replicate.com/jagilley/controlnet-pose${utm}`,
      }
    ]
  },
];

CONTROLNET_MODELS.forEach((model) => {
  model.links.push({
    name: "github",
    url: "https://github.com/lllyasviel/ControlNet",
  });
});

export default CONTROLNET_MODELS;
