import Replicate from "replicate";

export default async function getFineTunes() {
  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
  });

  const promptTemplates = new Map([
    [
      "sdxl-tron",
      "{prompt} in the style of TRN"
    ],
    [
      "sdxl-barbie",
      "{prompt} in the style of TOK"
    ],
    [
      "sdxl-woolitize",
      "{prompt} in the style of TOK, made of wool, focus blur"
    ],
    [
      "sdxl-sonic-2",
      "A screenshot in the style of TOK, pixel art, 2d platform game, sharp, {prompt}"
    ],
    [
      "sdxl-70s-scifi",
      "{prompt}, in the style of TOK"
    ],
    [
      "sdxl-gta-v",
      "video game art, in the style of TOK, {prompt}"
    ],
    [
      "iwan-baan-sdxl",
      "{prompt} in the style of TOK"
    ],
    [
      "loteria",
      "a {prompt} card in the style of TOK"
    ],
    [
      "sdxl-vision-pro",
      "a photo of {prompt} wearing a TOK VR headset, faces visible"
    ],
    [
      "nammeh",
      "Photo in style of NAMMEH, {prompt}"
    ],
    [
      "sdxl-davinci",
      "a drawing of {prompt} in the style of TOK"
    ],
    [
      "sdxl-cross-section",
      "A cross section TOK of {prompt}"
    ],
    [
      "sdxl-money",
      "{prompt} on a bank note in the style of TOK"
    ],
    [
      "sdxl-illusions",
      "{prompt} in the style of TOK"
    ]
  ]);

  const collectionResponse = await replicate.collections.get("sdxl-fine-tunes")
  return collectionResponse.models.map((m, i) => {
    const model = {
      id: i,
      owner: m.owner,
      name: m.name,
      default_params: m.default_example.input,
      prompt_template: promptTemplates.get(m.name),
      prompt_example: m.default_example.input.prompt,
      version: m.latest_version.id,
      checked: false,
      source: "replicate",
      url: m.url,
      description: m.description,
      links: [
        {
          name: "replicate",
          url: m.url
        }
      ],
      // new fields
      cover_image_url: m.cover_image_url,
    }

    delete model.default_params.prompt

    return model
  })
}