import type { NextApiRequest, NextApiResponse } from "next";

export type Content = {
  title: string;
  body: string;
};

export const contents: Content[] = [
  { title: "First", body: "May the force be with you" },
  { title: "Second", body: "Cupidatat ea veniam esse" },
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case "GET":
      res.status(200).json(contents);
      break;
    case "POST":
      try {
        const { title, body }: Content = req.body;
        contents.push({ title, body });
        res.status(201).json(title);
      } catch (err) {
        console.error(err);
        res.status(400).end("Bad request");
      }
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
