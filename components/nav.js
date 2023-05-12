import Link from "next/link";
import { useRouter } from "next/router";

export default function Nav() {
  const router = useRouter();

  return (
    <nav className="p-5 border-t-4 border-t-brand">
      <div className="flex">
        <Link href="/">
          <div className="hover:animate-spin flex-shrink-0 mb-0">
            <img className="w-18 h-12 rounded-lg" src="/zoo.png" alt="" />
          </div>
        </Link>
        <div className="flex w-full justify-between">
          <div className="flex text-lg items-center font-bold justify-center">
            <Link href="/">
              <h4>
                <span className="invisible font-medium sm:visible ml-1">
                  Image Playground
                </span>
              </h4>
            </Link>
            <Link href="https://replicate.com?utm_source=project&utm_campaign=zoo">
              <h4 className="hover:underline">
                <span className="text-zinc-500 ml-2 font-light">
                  <span className="sm:visible invisible">Powered</span> by
                  Replicate
                </span>
              </h4>
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
              <Link
                href="/memories"
                type="button"
                className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                Memories
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
