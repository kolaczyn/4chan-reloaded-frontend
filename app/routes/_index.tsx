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
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Boards</h1>
      <ul>
        {boards.map((x) => (
          <li key={x.slug}>
            <a href={`/boards/${x.slug}`}>{x.name}</a>
            {isJanny && <button disabled>Delete</button>}
          </li>
        ))}
      </ul>

      <a href="/changelog">See changelog</a>
      <br />
      {isJanny && <a href="/janny">Go to panel</a>}
    </div>
  );
};

export default HomePage;
