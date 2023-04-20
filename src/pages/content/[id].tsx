import { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { FormEvent, useState, useRef } from "react";
import useSwr from "swr";
import axios from "axios";
import { Contents } from "@prisma/client";

async function fetcher(url: string) {
  return fetch(url).then((res) => res.json());
}

function Content({ id }: { id: string }): JSX.Element {
  const { data } = useSwr<Contents>(`/api/contents/${id}`, fetcher);
  const titleRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const datetimeRef = useRef<HTMLInputElement>(null);
  const [checked, setChecked] = useState<boolean>(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault;

    if (!titleRef.current || !bodyRef.current) return;
    axios
      .put(`/api/contents/${id}`, {
        title: titleRef.current.value,
        body: bodyRef.current.value,
        publishedAt: datetimeRef.current?.value
          ? new Date(datetimeRef.current.value)
          : new Date(),
      })
      .catch((err) => console.error(err));
  };

  return (
    <>
      <Head>
        <title>Kontrol! - Content</title>
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
        {data && (
          <div className="w-96 mb-6">
            <form onSubmit={handleSubmit}>
              <div className="mb-2">
                <label htmlFor="title">Title</label>
                <br />
                <input
                  ref={titleRef}
                  id="title"
                  type="text"
                  defaultValue={data.title}
                  autoComplete="off"
                  required
                  className="p-1 rounded-sm w-full"
                />
              </div>
              <div className="mb-2">
                <label htmlFor="body">Body</label>
                <br />
                <textarea
                  ref={bodyRef}
                  id="body"
                  defaultValue={data.body}
                  required
                  className="p-1 rounded-sm w-full"
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
                  className="p-1 rounded-sm w-full disabled:cursor-not-allowed"
                />
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
        )}
        <div>
          <Link href="/content" className="text-blue-400 hover:text-blue-300">
            View all contents
          </Link>
        </div>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;
  return {
    props: {
      id,
    },
  };
};

export default Content;
