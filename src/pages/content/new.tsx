import Head from "next/head";
import Link from "next/link";
import { FormEvent, useState, useRef } from "react";
import axios from "axios";

function NewContent(): JSX.Element {
  const titleRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const datetimeRef = useRef<HTMLInputElement>(null);
  const [checked, setChecked] = useState<boolean>(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault;

    if (!titleRef.current || !bodyRef.current) return;
    const datetime = datetimeRef.current?.value;
    axios
      .post("/api/contents", {
        title: titleRef.current.value,
        body: bodyRef.current.value,
        publishedAt: datetime ? new Date(datetime) : new Date(),
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
        <div className="absolute right-8 top-8 text-3xl">
          <Link href="/" className="cursor-pointer">
            🦄
          </Link>
        </div>
        <div className="mb-6 w-96">
          <form onSubmit={handleSubmit}>
            <div className="mb-2">
              <label htmlFor="title">Title</label>
              <br />
              <input
                ref={titleRef}
                id="title"
                type="text"
                autoComplete="off"
                required
                className="w-full rounded-sm p-1"
              />
            </div>
            <div className="mb-2">
              <label htmlFor="body">Body</label>
              <br />
              <textarea
                ref={bodyRef}
                id="body"
                required
                className="w-full rounded-sm p-1"
              ></textarea>
            </div>
            <div className="mb-2">
              <input
                id="schedule-checkbox"
                type="checkbox"
                checked={checked}
                onChange={() => setChecked(!checked)}
                className="mr-2 hover:cursor-pointer"
              />
              <label htmlFor="schedule-checkbox">Schedule Publish</label>
            </div>
            <div className="mb-2">
              <input
                ref={datetimeRef}
                type="datetime-local"
                disabled={!checked}
                required
                className="w-full rounded-sm p-1 disabled:cursor-not-allowed"
              />
            </div>
            <div className="flex content-center">
              <button
                type="submit"
                className="w-full rounded-sm bg-gray-700 p-1 hover:bg-gray-600"
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
