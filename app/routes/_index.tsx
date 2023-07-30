import type { ActionArgs, V2_MetaFunction } from "@remix-run/node";
import type { BoardsListDto } from "~/types";
import { Form, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { useRef } from "react";
import { API_URL } from "~/constants";

export const loader = async () => {
  const res: BoardsListDto = await fetch(API_URL).then((res) => res.json());
  return res;
};

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const slug = formData.get("slug");
  const name = formData.get("name");

  const res = await fetch(API_URL, {
    method: "post",
    body: JSON.stringify({ slug, name }),
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });

  return json(await res.json());
};

export const meta: V2_MetaFunction = () => [
  { title: "New Remix App" },
  { name: "description", content: "Welcome to Remix!" },
];

const HomePage = () => {
  const data = useLoaderData<typeof loader>();

  const slugInputRef = useRef<HTMLInputElement | null>(null);
  const nameInputRef = useRef<HTMLInputElement | null>(null);

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
      <h2>Create new board</h2>
      <Form method="POST">
        <input name="slug" ref={slugInputRef} />
        <input name="name" ref={nameInputRef} />
        <button type="submit">Submit</button>
      </Form>
    </div>
  );
};

export default HomePage;
