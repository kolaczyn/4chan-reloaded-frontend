import { API_URL } from "~/constants";
import type { ActionArgs, DataFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import type { BoardsThreadsDto } from "~/types";
import { useRef } from "react";

export const loader = async ({ params }: DataFunctionArgs) => {
  const boardSlug = params.boardSlug;
  const res: BoardsThreadsDto = await fetch(`${API_URL}/${boardSlug}`).then(
    (res) => res.json()
  );
  return res;
};

export const action = async ({ request, params }: ActionArgs) => {
  const formData = await request.formData();
  const message = formData.get("message");

  const res = await fetch(`${API_URL}/${params.boardSlug}/threads`, {
    method: "post",
    body: JSON.stringify({ message }),
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  }).then((res) => res.json());

  return res;
};

const BoardPage = () => {
  const data = useLoaderData<typeof loader>();
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <>
      <h1>
        /{data.slug}/ - {data.name}
      </h1>
      <a href="/">Back</a>
      <div>
        <Form method="POST">
          <input ref={inputRef} name="message" />
          <br />
          <button type="submit">Start a new thread</button>
        </Form>
      </div>
      {!!data.threads.length && (
        <div>
          <h2>Threads:</h2>
          <ul>
            {data.threads.map((x) => (
              <li key={x.id}>
                <a href={`/boards/${data.slug}/${x.id}`}>
                  {x.message} ({x.repliesCount})
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default BoardPage;
