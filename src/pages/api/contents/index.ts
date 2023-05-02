import type { NextApiRequest, NextApiResponse } from "next";

import prisma from "@/lib/prisma";

async function createContent(title: string, body: string, publishedAt: Date) {
  return await prisma.contents.create({
    data: {
      versions: {
        create: [{ title: title, body: body, publishedAt: publishedAt }],
      },
    },
  });
}

async function getContent() {
  return await prisma.contents.findMany({
    include: {
      versions: {
        where: { publishedAt: { lte: new Date() } },
        orderBy: { id: "desc" },
        take: 1,
      },
    },
    orderBy: { id: "asc" },
  });
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case "GET":
      const contents = await getContent();
      res.status(200).json(contents);
      break;
    case "POST":
      const { title, body, publishedAt, delay } = req.body;
      setTimeout(async () => {
        const content = await createContent(title, body, publishedAt);
        res.status(201).json(content);
      }, delay);
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

export default handler;
