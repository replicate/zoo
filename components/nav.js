import Link from "next/link";
import { useRouter } from "next/router";

export default function Nav() {
  const router = useRouter();

  return (
    <nav class="p-5">
      <div className="flex">
        <div className="flex-shrink-0 mb-0 mr-4">
          <span className="text-4xl">🦓</span>
        </div>
        <div className="flex w-full justify-between">
          <Link href="/" class="flex hover:underline">
            <h4 className="text-lg items-center flex font-bold justify-center">
              Zoo{" "}
              <span className="text-zinc-500 ml-2 font-light">
                Image Playground • Powered by Replicate
              </span>
            </h4>
          </Link>
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
