import Link from "next/link";

export default function Submissions({ predictions, prompt }) {
  function getPredictionOutput(prediction) {
    if (prediction) {
      return prediction.output
        ? prediction.output[prediction.output.length - 1]
        : "";
    } else {
      return "";
    }
  }
  return (
    <div className="mx-auto container p-5">
      <div className="flex justify-between gax-x-4">
        <h5 className="font-extrabold tracking-tight text-2xl sm:text-4xl">
          "{prompt}"
        </h5>
      </div>
      <p className="mt-4 text-gray-500">
        These outputs were created by Zoo, an image playground by{" "}
        <Link
          href="https://replicate.com?utm_source=project&utm_campaign=zoo"
          className="hover:underline font-semibold"
        >
          Replicate
        </Link>
        .
        <Link
          href="/"
          className="text-brand font-bold hover:underline hover:text-orange-500 pl-2"
        >
          Run it yourself!
        </Link>
      </p>
      <ul
        role="list"
        className="mt-12 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8"
      >
        {predictions
          .filter((prediction) => prediction)
          .map((prediction) => (
            <li key={prediction.id} className="relative">
              <div className="group aspect-h-7 aspect-w-10 block w-full overflow-hidden rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100">
                <img
                  src={getPredictionOutput(prediction)}
                  alt=""
                  className="pointer-events-none object-cover group-hover:opacity-75"
                />
                <a
                  href={getPredictionOutput(prediction)}
                  className="absolute inset-0 focus:outline-none"
                  download={`${prediction.id}.png`}
                />
              </div>
              <p className="pointer-events-none mt-2 block truncate text-sm font-medium text-gray-900">
                {prediction.model}
              </p>
            </li>
          ))}
      </ul>
    </div>
  );
}
export async function getServerSideProps({ req }) {
  // Hack to get the protocol and host from headers:
  // https://github.com/vercel/next.js/discussions/44527
  const protocol = req.headers.referer?.split("://")[0] || "http";
  const submissionId = req.url.split("/")[2];
  const baseUrl = `${protocol}://${req.headers.host}`;
  const response = await fetch(`${baseUrl}/api/submissions/${submissionId}`);
  const { predictions, prompt } = await response.json();
  return { props: { baseUrl, predictions, prompt } };
}
