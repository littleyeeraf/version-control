import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { FormEvent, useState, useRef, useEffect } from "react";
import useSwr from "swr";
import axios from "axios";
import { Contents, ContentVersions } from "@prisma/client";

import Loading from "@/components/loading/spin";

async function fetcher(url: string) {
  return fetch(url).then((res) => res.json());
}

function Content({ id, now }: { id: string; now: number }): JSX.Element {
  const router = useRouter();
  const { data, isLoading, mutate } = useSwr<
    Contents & { versions: ContentVersions[] }
  >(`/api/contents/${id}`, fetcher);

  const titleRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const datetimeRef = useRef<HTMLInputElement>(null);
  const [checked, setChecked] = useState<boolean>(false);
  const machineTime = new Date().getTime();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault;

    if (!titleRef.current || !bodyRef.current) return;

    const title = titleRef.current.value;
    const body = bodyRef.current.value;
    const datetime = datetimeRef.current?.value;

    try {
      if (datetime) {
        const dt = new Date(datetime);
        const elapsed = new Date().getTime() - machineTime;
        const delay = dt.getTime() - (now + elapsed);

        await mutate(
          axios.put(`/api/contents/${id}`, {
            title: title,
            body: body,
            publishedAt: dt,
            delay: delay,
          }),
          {
            rollbackOnError: true,
            revalidate: true,
          }
        );
      } else {
        await mutate(
          axios.put(`/api/contents/${id}`, {
            title: title,
            body: body,
            publishedAt: new Date(),
            delay: 0,
          }),
          {
            rollbackOnError: true,
            revalidate: true,
          }
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (data && data.versions.length === 0) {
      router.push("/content");
    }
  });

  if (isLoading) return <Loading />;

  return (
    <>
      <Head>
        <title>Kontrol! - Content</title>
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
        {data && (
          <div className="mb-6 w-96">
            <form onSubmit={handleSubmit}>
              <div className="mb-2">
                <label htmlFor="title">Title</label>
                <br />
                <input
                  ref={titleRef}
                  id="title"
                  type="text"
                  defaultValue={data.versions[0]?.title}
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
                  defaultValue={data.versions[0]?.body}
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

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { id } = context.query;

  return {
    props: {
      id,
      now: new Date().getTime(),
    },
  };
}

export default Content;
