import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import seeds from "../lib/seeds";

export default function Nav() {
  const router = useRouter();
  const { id } = router.query;
  const [linkCopied, setLinkCopied] = useState(false);

  const copyToClipboard = (e) => {
    navigator.clipboard.writeText(window.location.toString());
    setLinkCopied(true);
  };

  const redirectToRandom = () => {
    if (router.pathname == "/memories") {
      router.pathname = "/";
      router.push(router);
    } else {
      const seed = seeds[Math.floor(Math.random() * seeds.length)];
      router.query.id = seed;

      router.push(router);
      setTimeout(() => {
        router.reload();
      }, 500);
    }
  };

  // Clear the "Copied!" message after 4 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      setLinkCopied(false);
    }, 4 * 1000);

    return () => clearInterval(intervalId);
  }, [id]);

  const logoRef = useRef(null);

  const onMouseEnter = () => {
    logoRef.current.classList.add("hovered");
  };

  return (
    <nav className="p-5 border-t-4 border-t-brand">
      <div className="flex">
        <button
          id="logo"
          onClick={() => redirectToRandom()}
          ref={logoRef}
          onMouseEnter={onMouseEnter}
          className="flex-shrink-0 mb-0 mr-4"
        >
          <span className="text-4xl">🦓</span>
        </button>
        <div className="flex w-full justify-between">
          <div className="sm:flex text-lg items-center font-bold justify-center">
            <button
              onClick={() => redirectToRandom()}
              className="hover:underline text-sm sm:text-lg "
            >
              <h4>Zoo </h4>
            </button>
            <Link
              className="flex text-sm lg:text-base sm:pl-2 text-zinc-500 font-light hover:underline"
              href="https://github.com/replicate/zoo?utm_source=project&utm_campaign=zoo"
            >
              Open Source
            </Link>
            <Link
              className="flex text-sm lg:text-base sm:pl-1"
              href="https://replicate.com?utm_source=project&utm_campaign=zoo"
            >
              <span className="text-zinc-500 font-light hover:underline">
                <span className="hidden sm:inline text-zinc-500 font-light">
                  Playground
                </span>
                <span className="sm:hidden inline">Powered</span> by Replicate
              </span>
            </Link>
          </div>

          <div className="">
            {router.pathname == "/memories" ? (
              <>
                <Link
                  href="/"
                  type="button"
                  className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  &larr; Back
                </Link>
              </>
            ) : (
              <div className="flex">
                {id && (
                  <button
                    onClick={() => copyToClipboard()}
                    type="button"
                    className="animate-drop mr-3 inline-flex justify-center items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  >
                    {linkCopied ? (
                      "Copied!"
                    ) : (
                      <span>
                        Copy <span className="hidden sm:inline-flex">link</span>
                      </span>
                    )}
                  </button>
                )}
                <Link
                  href="/memories"
                  type="button"
                  className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  Memories
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
