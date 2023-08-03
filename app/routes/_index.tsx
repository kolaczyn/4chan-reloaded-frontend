import type { DataFunctionArgs, V2_MetaFunction } from "@remix-run/node";
import type { BoardsListDto } from "~/types";
import { useLoaderData } from "@remix-run/react";
import { API_URL } from "~/constants";
import { getIsJannyFromCookie } from "~/utils/getIsJannyFromCookie";

export const loader = async ({ request }: DataFunctionArgs) => {
  const boards: BoardsListDto = await fetch(API_URL).then((res) => res.json());
  const isJanny = await getIsJannyFromCookie(request);

  return {
    isJanny,
    boards,
  };
};

export const meta: V2_MetaFunction = () => [
  { title: "Boards" },
  { name: "description", content: "A simple messageboard" },
];

const HomePage = () => {
  const { boards, isJanny } = useLoaderData<typeof loader>();

  return (
    <div className="max-w-2xl mx-auto py-4">
      <h1 className="text-3xl">Boards</h1>
      <ul className="my-5">
        {boards.map((x) => (
          <li key={x.slug}>
            <a
              className="text-blue-500 hover:underline font-bold"
              href={`/boards/${x.slug}`}
            >
              {x.name}
            </a>
            {isJanny && <button disabled>Delete</button>}
          </li>
        ))}
      </ul>

      <div className="space-x-3">
        <a className="text-blue-500 hover:underline" href="/changelog">
          See changelog
        </a>
        <a
          className="text-blue-500 hover:underline"
          href="https://api.kolaczyn.com/rss.xml"
          target="_blank"
          rel="noreferrer"
        >
          RSS feed
        </a>
        {isJanny && <a href="/janny">Go to panel</a>}
      </div>
    </div>
  );
};

export default HomePage;
