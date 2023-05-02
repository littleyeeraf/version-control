import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import useSwr from "swr";
import { Contents, ContentVersions } from "@prisma/client";

import Loading from "@/components/loading/spin";

async function fetcher(url: string) {
  return fetch(url).then((res) => res.json());
}

function AllContent(): JSX.Element {
  const router = useRouter();
  const { data, isLoading } = useSwr<
    (Contents & { versions: ContentVersions[] })[]
  >("/api/contents", fetcher);

  const handleClick = (id: number) => {
    router.push(`/content/${id}`);
  };

  if (isLoading) return <Loading />;

  return (
    <>
      <Head>
        <title>Kontrol! - All Contents</title>
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
        <div className="mb-6 flex flex-col items-center">
          <h2 className="text-3xl">All Contents</h2>
          <p className="text-gray-400">These are awesome!</p>
        </div>
        {data && data[0]?.versions.length > 0 && (
          <div className="mb-6 w-96">
            <ul>
              {data
                .filter((content) => content.versions[0])
                .map((content) => (
                  <li key={content.id} className="mb-2 last:mb-0">
                    <div
                      onClick={() => handleClick(content.id)}
                      className="rounded-md bg-gray-700 p-4 hover:cursor-pointer hover:bg-gray-600"
                    >
                      <h2 className="text-3xl">{content.versions[0].title}</h2>
                      <p className="text-gray-400">
                        {content.versions[0].body}
                      </p>
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

export default AllContent;
