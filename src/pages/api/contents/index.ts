import type { NextApiRequest, NextApiResponse } from "next";

import prisma from "@/lib/prisma";

async function createContent(title: string, body: string) {
  return await prisma.contents.create({ data: { title: title, body: body } });
}

async function getContent() {
  return await prisma.contents.findMany({ orderBy: { id: "asc" } });
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case "GET":
      const contents = await getContent();
      res.status(200).json(contents);
      break;
    case "POST":
      const { title, body } = req.body;
      const content = await createContent(title, body);
      res.status(201).json(content);
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

export default handler;
