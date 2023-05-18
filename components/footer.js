import Link from "next/link";
import Image from "next/image";
import "react-tooltip/dist/react-tooltip.css";
import { Tooltip } from "react-tooltip";

const linkStyles =
  "inline-block relative w-12 h-12 mx-2 opacity-30 hover:opacity-100 transition-all duration-200";
const imageStyles =
  "p-3 hover:p-1  transition-all duration-200  saturate-0 hover:saturate-100";

export default function Footer() {
  return (
    <footer className="mt-20 mb-10">
      <div className="flex justify-center">
        <p className="text-lg text-gray-700">
          Zoo is an open source project from{" "}
          <Link
            className="underline"
            href="https://replicate.com?utm_source=project&utm_campaign=zoo"
          >
            Replicate
          </Link>
          .
        </p>
      </div>

      <div className="flex justify-center mt-4">
        <Tooltip id="replicate-tooltip" />
        <Tooltip id="openai-tooltip" />
        <Tooltip id="vercel-tooltip" />
        <Tooltip id="supabase-tooltip" />
        <Tooltip id="github-tooltip" />

        <Link
          className={linkStyles}
          href="https://replicate.com?utm_source=project&utm_campaign=zoo"
        >
          <Image
            src="/logomarks/replicate.svg"
            alt="Replicate"
            data-tooltip-id="replicate-tooltip"
            data-tooltip-content="Built by Replicate"
            className={imageStyles}
            fill={true}
            unoptimized={true}
          />
        </Link>
        <Link className={linkStyles} href="https://openai.com/product/dall-e-2">
          <Image
            src="/logomarks/openai.svg"
            data-tooltip-id="openai-tooltip"
            data-tooltip-content="DALL-E model powered by OpenAI"
            alt="OpenAI"
            className={imageStyles}
            fill={true}
            unoptimized={true}
          />
        </Link>
        <Link className={linkStyles} href="https://vercel.com/templates/ai">
          <Image
            src="/logomarks/vercel.svg"
            data-tooltip-id="vercel-tooltip"
            data-tooltip-content="Hosted on Vercel"
            alt="Vercel"
            className={imageStyles}
            fill={true}
            unoptimized={true}
          />
        </Link>
        <Link className={linkStyles} href="https://github.com/replicate/zoo">
          <Image
            src="/logomarks/supabase.svg"
            data-tooltip-id="supabase-tooltip"
            data-tooltip-content="PostgreSQL database and file storage from Supabase"
            alt="PostgreSQL database and file storage from Supabase"
            className={imageStyles}
            fill={true}
            unoptimized={true}
          />
        </Link>
        <Link className={linkStyles} href="https://github.com/replicate/zoo">
          <Image
            src="/logomarks/github.svg"
            data-tooltip-id="github-tooltip"
            data-tooltip-content="Open-source repository on GitHub"
            alt="Open-source repository on GitHub"
            className={imageStyles}
            fill={true}
            unoptimized={true}
          />
        </Link>
      </div>
    </footer>
  );
}
