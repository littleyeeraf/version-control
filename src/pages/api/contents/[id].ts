import type { NextApiRequest, NextApiResponse } from "next";

import prisma from "@/lib/prisma";

async function getContentByID(id: number) {
  return await prisma.contents.findUnique({
    where: { id: id },
    include: {
      versions: { orderBy: { id: "asc" } },
    },
  });
}

async function updateContent(
  id: number,
  title: string,
  body: string,
  publishedAt: Date
) {
  return await prisma.contentVersions
    .updateMany({
      where: { contentId: id },
      data: { published: false },
    })
    .then(() =>
      prisma.contents.update({
        where: { id: id },
        data: {
          versions: {
            create: [
              {
                title: title,
                body: body,
                published: true,
                publishedAt: publishedAt,
              },
            ],
          },
        },
      })
    );
}

async function updateContentVersion(contentId: number, id: number) {
  return await prisma.$transaction([
    prisma.contentVersions.updateMany({
      where: { contentId: contentId },
      data: { published: false },
    }),
    prisma.contentVersions.update({
      where: { id: id },
      data: { published: true },
    }),
  ]);
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const contentId = Number(req.query.id);

  switch (method) {
    case "GET":
      const content = await getContentByID(contentId);

      content
        ? res.status(200).json(content)
        : res.status(404).end(`Not Found`);
      break;
    case "PUT":
      const { title, body, publishedAt, delay } = req.body;

      setTimeout(async () => {
        const uContent = await updateContent(
          contentId,
          title,
          body,
          publishedAt
        );
        res.status(200).json(uContent);
      }, delay);
      break;
    case "PATCH":
      const { id } = req.body;
      const uVersion = await updateContentVersion(contentId, id);

      res.status(200).json(uVersion);
      break;
    default:
      res.setHeader("Allow", ["GET", "PUT", "PATCH"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

export default handler;
