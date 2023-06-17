import Head from "next/head";

export default function ZooHead({ ogDescription, ogImage }) {
  return (
    <Head>
      <title>Zoo</title>
      <link
        rel="icon"
        href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%2210 0 100 100%22><text y=%22.90em%22 font-size=%2290%22>🦓</text></svg>"
      ></link>

      <meta property="og:title" content="Zoo" />
      {ogDescription && (
        <meta property="og:description" content={ogDescription} />
      )}
      {ogImage && (
        <>
          <meta property="og:image" content={ogImage} />
          <meta property="twitter:image" content={ogImage} />
          <meta name="twitter:card" content="summary_large_image" />
        </>
      )}
    </Head>
  );
}
