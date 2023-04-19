import Head from "next/head";
import Link from "next/link";
import { FormEvent, useRef } from "react";
import axios from "axios";

function NewContent(): JSX.Element {
  const titleRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault;

    if (!titleRef.current || !bodyRef.current) return;
    axios
      .post("/api/contents", {
        title: titleRef.current.value,
        body: bodyRef.current.value,
      })
      .catch((err) => console.error(err));
  };

  return (
    <>
      <Head>
        <title>Kontrol! - New Content</title>
        <meta name="description" content="Created by Yee" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="relative flex flex-col items-center p-8">
        <div className="absolute top-8 right-8 text-3xl">
          <Link href="/" className="cursor-pointer">
            🦄
          </Link>
        </div>
        <div className="w-96 mb-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-2">
              <label htmlFor="title">Title</label>
              <br />
              <input
                id="title"
                type="text"
                ref={titleRef}
                autoComplete="off"
                required
                className="p-1 rounded-sm w-full"
              />
            </div>
            <div className="mb-2">
              <label htmlFor="body">Body</label>
              <br />
              <textarea
                id="body"
                ref={bodyRef}
                required
                className="p-1 rounded-sm w-full"
              ></textarea>
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
        <div>
          <Link href="/content" className="text-blue-400 hover:text-blue-300">
            View all contents
          </Link>
        </div>
      </main>
    </>
  );
}

export default NewContent;
