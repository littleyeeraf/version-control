import type { NextApiRequest, NextApiResponse } from "next";

import prisma from "@/lib/prisma";

async function getContentByID(id: number) {
  return await prisma.contents.findUnique({ where: { id: id } });
}

async function updateContent(id: number, title: string, body: string) {
  return await prisma.contents.update({
    where: { id: id },
    data: { title: title, body: body },
  });
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const id = Number(req.query.id);

  switch (method) {
    case "GET":
      const content = await getContentByID(id);
      res.status(200).json(content);
      break;
    case "PUT":
      const { title, body } = req.body;
      const uContent = await updateContent(id, title, body);
      res.status(200).json(uContent);
      break;
    default:
      res.setHeader("Allow", ["GET", "PUT"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

export default handler;
