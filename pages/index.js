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

          <div className="cta my-24 flex justify-center space-x-5 items-center">
            <a
              className="text-white bg-black p-5 flex"
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
              className="text-white bg-black p-5 flex"
              href="https://replicate.com/collections/text-to-image?utm_source=project&utm_campaign=zoo"
            >
              <ReplicateLogo className="mr-2" width={24} />
              Explore AI models on Replicate
            </a>
          </div>
        </div>

        {/* <ul className="features flex space-x-24">
          <li className="feature">
            <h3 className="text-2xl font-bold mb-4">
              Run multiple text-to-image models side-by-side.
            </h3>
            <p>
              Zoo lets you explore the differences between text-to-image models,
              comparing output images side-by-side.
            </p>
          </li>
          <li className="feature">
            <h3 className="text-2xl font-bold mb-4">
              Try multiple text-to-image models at the same time.
            </h3>
            <p>
              Zoo is a place to play with machine learning models, and to share
              your own. It's free and open source.
            </p>
          </li>
          <li className="feature">
            <h3 className="text-2xl font-bold mb-4">
              Try multiple text-to-image models at the same time.
            </h3>
            <p>
              Zoo is a place to play with machine learning models, and to share
              your own. It's free and open source.
            </p>
          </li>
        </ul> */}
      </div>
      <img
        className="mt-24"
        src="/browser-screenshot.webp"
        alt="screenshot of Zoo, the open source playground by Replicate"
      />
    </div>
  );
}
