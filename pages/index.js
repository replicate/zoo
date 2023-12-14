import GithubLogo from "../components/github-logo";
import ReplicateLogo from "../components/replicate-logo";

export default function Home() {
  return (
    <div className="landing-page container flex-column mx-auto mt-24">
      <div className="hero mx-auto">
        <div className="hero-text text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">
            🦓 Zoo is an open source text-to-image playground by{" "}
            <a href="https://replicate.com?utm_source=project&utm_campaign=zoo">
              Replicate
            </a>
            .
          </h1>

          <div className="cta my-24 justify-center items-center flex-col sm:flex sm:flex-row">
            <a
              className="text-white bg-black p-5 flex mb-2 mx-6"
              href="https://github.com/replicate/zoo?utm_source=project&utm_campaign=zoo"
            >
              <GithubLogo
                width={24}
                height={24}
                className="mr-2"
                fill="#ffffff"
              />
              Code on Github
            </a>
            <a
              className="text-white bg-black p-5 flex mb-2 mx-6"
              href="https://replicate.com/collections/text-to-image?utm_source=project&utm_campaign=zoo"
            >
              <ReplicateLogo className="mr-2" width={24} />
              Explore AI models on Replicate
            </a>
          </div>
        </div>
      </div>
      <img
        className="mt-24"
        src="/browser-screenshot.webp"
        alt="screenshot of Zoo, the open source playground by Replicate"
      />
    </div>
  );
}
