import Head from "next/head";
import Link from "next/link";
import useSwr from "swr";

import { Contents } from "@prisma/client";

async function fetcher(url: string) {
  return fetch(url).then((res) => res.json());
}

function Content(): JSX.Element {
  const { data } = useSwr<Contents[]>("/api/contents", fetcher);

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
        <div className="mb-6">
          <h2 className="text-3xl">All Contents</h2>
          <p className="text-gray-400">These are awesome!</p>
        </div>
        {data && (
          <div className="mb-6 w-96">
            <ul>
              {data.map((content) => (
                <li key={content.title} className="mb-2 last:mb-0">
                  <div className="rounded-md p-4 bg-gray-700">
                    <h2 className="text-3xl">{content.title}</h2>
                    <p className="text-gray-400">{content.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div>
          <Link
            href="/content/new"
            className="text-blue-400 hover:text-blue-300"
          >
            Create a new content
          </Link>
        </div>
      </main>
    </>
  );
}

export default Content;
