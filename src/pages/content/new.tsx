import Head from "next/head";
import Link from "next/link";

export default function NewContent() {
  return (
    <>
      <Head>
        <title>Kontrol! - New Content</title>
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
          <form action="/api/contents" method="POST">
            <div className="mb-2">
              <label htmlFor="title">Title</label>
              <br />
              <input id="title" type="text" className="p-1 rounded-sm" />
            </div>
            <div className="mb-2">
              <label htmlFor="desc">Description</label>
              <br />
              <textarea id="desc" className="p-1 rounded-sm"></textarea>
            </div>
            <div className="flex content-center">
              <button
                type="submit"
                className="p-1 w-full rounded-sm bg-gray-700 hover:bg-gray-600"
              >
                Publish
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
