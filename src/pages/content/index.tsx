import Head from "next/head";
import Link from "next/link";

export default function Content() {
  return (
    <>
      <Head>
        <title>Kontrol! - Content</title>
        <meta name="description" content="Created by Yee" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="relative flex flex-col items-center p-6">
        <div className="absolute top-6 right-6 text-3xl">
          <Link href="/" className="cursor-pointer">
            🦄
          </Link>
        </div>
        <div>
          <h2 className="text-3xl">All Contents</h2>
          <p className="text-gray-400">These are awesome!</p>
        </div>
      </main>
    </>
  );
}
