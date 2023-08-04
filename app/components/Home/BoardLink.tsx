import { BoardDto } from "~/types";

export const BoardLink = ({ slug, name }: BoardDto) => (
  <a
    className="text-blue-500 hover:underline font-bold"
    href={`/boards/${slug}`}
  >
    {name}
  </a>
);
