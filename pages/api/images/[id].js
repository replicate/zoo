const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default async function handler(req, res) {
  const prediction_id = req.query.id;

  if (!prediction_id || prediction_id == "undefined") {
    res.statusCode = 400;
    console.log("why is prediction id undefined?");
    res.end(JSON.stringify({ error: "id is required" }));
    return;
  }

  const url = `https://ennwjiitmiqwdrgxkevm.supabase.co/storage/v1/object/public/images/public/${prediction_id}.png`;

  console.log("url", url);
  let response = await fetch(url);

  if (response.status == 200) {
    return res.end(JSON.stringify(url));
  }

  const maxAttempts = 10;
  let currentAttempts = 0;

  while (response.status == 400 && currentAttempts < maxAttempts) {
    await sleep(500);
    response = await fetch(url);
    console.log("current attempts", currentAttempts);
    console.log("image status polling: ", response.status);
    currentAttempts += 1;
  }

  res.end(JSON.stringify(url));
}
