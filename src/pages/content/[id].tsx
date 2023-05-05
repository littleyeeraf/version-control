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
  const idRef = useRef<number>();
  const [isSchedule, setIsScheduled] = useState<boolean>(false);
  const [isRollback, setIsRollback] = useState<boolean>(false);
  const [selectedVersion, setSelectedVersion] = useState<number>();
  const machineTime = new Date().getTime();

  const updateContent = async (e: FormEvent) => {
    e.preventDefault;

    if (!titleRef.current || !bodyRef.current) return;

    const datetime = datetimeRef.current?.value;
    const dt = datetime ? new Date(datetime) : null;

    try {
      const elapsed = new Date().getTime() - machineTime;

      await mutate(
        axios.put(`/api/contents/${id}`, {
          title: titleRef.current.value,
          body: bodyRef.current.value,
          publishedAt: dt ? dt : new Date(),
          delay: dt ? dt.getTime() - (now + elapsed) : 0,
        }),
        {
          rollbackOnError: true,
          revalidate: true,
        }
      );
    } catch (err) {
      console.error(err);
    }
  };

  const updateContentVersion = async (e: FormEvent) => {
    e.preventDefault;

    if (!idRef.current) return;

    try {
      await mutate(
        axios.patch(`/api/contents/${id}`, {
          id: idRef.current,
        }),
        {
          rollbackOnError: true,
          revalidate: true,
        }
      );
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (data && data.versions) {
      if (data.versions.length === 0) {
        router.push("/content");
        return;
      }
      for (let i = 0; i < data.versions.length; i++) {
        if (data.versions[i].published) {
          setSelectedVersion(i);
          idRef.current = data.versions[i].id;
          return;
        }
      }
    }
  }, [data, router]);

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
        {data && data.versions && selectedVersion !== undefined && (
          <div className="mb-6 w-96">
            <form onSubmit={updateContentVersion} className="mb-6">
              <div className="mb-2">
                <input
                  id="rollback-checkbox"
                  type="checkbox"
                  checked={isRollback}
                  onChange={() => setIsRollback(!isRollback)}
                  className="mr-2 hover:cursor-pointer"
                />
                <label htmlFor="rollback-checkbox">Rollback Version</label>
              </div>
              <div className="mb-2">
                <select
                  value={selectedVersion}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    setSelectedVersion(value);
                    idRef.current = data.versions[value].id;
                  }}
                  disabled={!isRollback}
                  required
                  className="w-full rounded-sm p-1 disabled:cursor-not-allowed"
                >
                  {data.versions.map((version, index) => (
                    <option key={index} value={index}>
                      version: {index + 1}
                      {version.published && "*"}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex content-center">
                <button
                  type="submit"
                  className="w-full rounded-sm bg-gray-700 p-1 hover:bg-gray-600"
                >
                  Revert
                </button>
              </div>
            </form>

            <form onSubmit={updateContent}>
              <div className="mb-2">
                <label htmlFor="title">Title</label>
                <br />
                <input
                  ref={titleRef}
                  id="title"
                  type="text"
                  key={selectedVersion}
                  defaultValue={data.versions[selectedVersion].title}
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
                  key={selectedVersion}
                  defaultValue={data.versions[selectedVersion].body}
                  required
                  className="w-full rounded-sm p-1"
                ></textarea>
              </div>
              <div className="mb-2">
                <input
                  id="schedule-checkbox"
                  type="checkbox"
                  checked={isSchedule}
                  onChange={() => setIsScheduled(!isSchedule)}
                  className="mr-2 hover:cursor-pointer"
                />
                <label htmlFor="schedule-checkbox">Schedule Publish</label>
              </div>
              <div className="mb-2">
                <input
                  ref={datetimeRef}
                  type="datetime-local"
                  disabled={!isSchedule}
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
