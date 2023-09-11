// import Replicate from "replicate";
import getFineTunes from "../../../lib/sdxlFineTunes"

export default async function handler(req, res) {
  const models = await getFineTunes()

  res.end(JSON.stringify(models))
}