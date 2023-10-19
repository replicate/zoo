/**
 * These seeds are ids pointing to a collection of predictions run on Zoo.
 *
 * To add a new seed, you need to generate predictions on Zoo and then
 * save the id url parameter of the submission.
 *
 * Here's how:
 * 1. Run Zoo locally with `npm run dev`
 * 2. Run ngrok with `ngrok http 3000`. Set your NGROK_HOST environment variable to the url ngrok gives you.
 * This is required because it serves as the endpoint for the webhook that saves predictions to the database.
 * 3. Create a submission (enter a prompt and press go)
 * 4. Save the id URL param and add it to the list here!
 */

const seeds = [
  "a-detailed-painting-of-fish-american-barbizon-school-by-diego-rivera-pxsz48",
  "a-digital-painting-of-ocean-waves-rayonism-by-alejandro-obregon-51pr569",
  "4f7c7890-c812-45ab-8527-84d4fd27eeb1",
  "a-still-life-of-birds-analytical-art-by-ludwig-knaus-nsf63w7",
  "a-comic-book-panel-of-cats-light-and-space-by-lucy-angeline-bacon-chiseled-jawline-eos-1d-swirly-vibrant-colors-hgprxe3f",
  "a-portrait-of-birds-verdadism-by-utagawa-kunimasa-retaildesignblog.net-hchuz0h",
  "a-mid-nineteenth-century-engraving-of-ocean-waves-art-informel-by-frank-barrington-craig-collage-style-joseba-elorza-wj1i53m",
  "a-marble-sculpture-of-cats-cubism-by-hans-falk-69d62m4",
  "ea7e7239-e607-41f9-b009-940c1801fd3a",
  "a-tilt-shift-photo-of-fish-tonalism-by-ugo-nespolo-e64c59hk",
  "a-digital-painting-of-ocean-waves-rayonism-by-alejandro-obregon-s2empk3k",
  "an-abstract-sculpture-of-trees-underground-comix-by-yoshiyuki-tomino-eq3d2m6",
  "an-acrylic-painting-of-fish-neogeo-by-zsolt-bodoni-in32quqf",
  "3ed0a1aa-95c4-40fa-ae7d-8dc42ca99765",
  "a7d43d6a-f891-403c-b89a-a48c44e35802",
  "5ff07bac-9944-411a-907f-ece852e2cec8",
  "9a3e0f4c-e01f-488e-90bc-218db60f66e7",
  "a9a7cb97-04d5-4ec3-a3ea-21d178092acb",
  "08fe73b4-2ab4-46b1-8a91-a4392b54997e",
  "a1920791-41e2-45f4-8cca-bcfc01440fd4",
  "831bbaa3-3071-43ad-aaa4-4765ffb95cd1",
];

module.exports = seeds;
