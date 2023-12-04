import { ImageResponse } from "@vercel/og";

export const config = {
  runtime: "edge",
};

// This endpoint take a query parameter `id` which is the ID of a prediction
// and returns an Open Graph image for that prediction
export default async function handler(req) {
  try {
    const { searchParams } = req.nextUrl;
    const bucketUrl =
      `${process.env.NEXT_PUBLIC_SUPABASE_IMAGES_URL}/storage/v1/object/public/images/public/`;
    let predictionIds = searchParams.get("ids").split(",");
    let outputUrls = predictionIds.map((id) => `${bucketUrl}${id}.png`);
    const prompt = searchParams.get("prompt");
    const done = searchParams.get("done");
    console.log("done", done);

    if (!done) {
      return new ImageResponse(<FallbackCard />, {
        width: 1200,
        height: 630,
      });
    }

    return new ImageResponse(
      <Card predictionUrls={outputUrls} prompt={prompt} />,
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.log("error with OG image", error);
    return new ImageResponse(<FallbackCard />, {
      width: 1200,
      height: 630,
    });
  }
}

function FallbackCard() {
  return (
    <div
      style={{
        display: "flex",
        background: "#f6f6f6",
        width: "100%",
        height: "100%",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: `url("https://github-production-user-asset-6210df.s3.amazonaws.com/14149230/239057353-08ca463c-bcbb-4614-be37-08edd4d542f1.png")`,
        backgroundRepeat: "repeat",
      }}
    ></div>
  );
}

function Card({ predictionUrls, prompt }) {
  const cardWidth = 1200;
  const cardHeight = 630;
  const cardPadding = 60;

  return (
    <div
      style={{
        display: "flex",
        position: "relative",
        width: cardWidth,
        height: cardHeight,
        background: "white",
        border: "1px solid #CCC",
        borderBottom: "15px solid #CCC",
        padding: cardPadding,
      }}
    >
      <img
        alt="img"
        style={{
          borderRadius: "5%",
          width: cardWidth / 4,
          height: cardWidth / 4,
          objectFit: "cover",
          marginRight: "5rem",
        }}
        src={predictionUrls[0]}
      />
      <img
        alt="img"
        style={{
          borderRadius: "5%",
          width: cardWidth / 4,
          height: cardWidth / 4,
          objectFit: "cover",
          marginRight: "5rem",
        }}
        src={predictionUrls[1]}
      />
      <img
        alt="img"
        style={{
          borderRadius: "5%",
          width: cardWidth / 4,
          height: cardWidth / 4,
          objectFit: "cover",
        }}
        src={predictionUrls[2]}
      />
      <div
        style={{
          display: "flex",
          position: "absolute",
          padding: cardPadding,
          bottom: 5,
          fontSize: 36,
          maxWidth: cardWidth - cardPadding * 2,
          flexWrap: "wrap",
          wordWrap: "break-word",
          // wordBreak: "break-all",
        }}
      >
        <span style={{ fontWeight: 800 }}>{prompt}</span>
      </div>
    </div>
  );
}
