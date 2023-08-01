import type { V2_MetaFunction } from "@remix-run/node";
import type { BoardsListDto } from "~/types";
import { useLoaderData } from "@remix-run/react";
import { API_URL } from "~/constants";

export const loader = async () => {
  const res: BoardsListDto = await fetch(API_URL).then((res) => res.json());
  return res;
};

export const meta: V2_MetaFunction = () => [
  { title: "Boards" },
  { name: "description", content: "A simple messageboard" },
];

const HomePage = () => {
  const data = useLoaderData<typeof loader>();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Boards</h1>
      <ul>
        {data.map((x) => (
          <li key={x.slug}>
            <a href={`/boards/${x.slug}`}>{x.name}</a>
          </li>
        ))}
      </ul>

      <a href="/changelog">See changelog</a>
    </div>
  );
};

export default HomePage;
