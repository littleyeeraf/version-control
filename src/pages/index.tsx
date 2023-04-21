import Head from "next/head";
import Link from "next/link";

function Home(): JSX.Element {
  return (
    <>
      <Head>
        <title>Kontrol!</title>
        <meta name="description" content="Created by Yee" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col items-center p-8">
        <div className="mb-4">
          <h1 className="text-4xl">🦒 Yeeraf 💛</h1>
        </div>
        <div>
          <ul className="list-disc text-blue-400">
            <li>
              <Link href="/content" className="hover:text-blue-300">
                View all contents
              </Link>
            </li>
            <li>
              <Link href="/content/new" className="hover:text-blue-300">
                Create a new content
              </Link>
            </li>
          </ul>
        </div>
      </main>
    </>
  );
}

export default Home;
