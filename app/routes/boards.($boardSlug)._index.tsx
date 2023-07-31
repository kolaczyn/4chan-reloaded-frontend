import { API_URL } from "~/constants";
import type { ActionArgs, DataFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData, useNavigation } from "@remix-run/react";
import type { BoardsThreadsDto } from "~/types";
import { useRef } from "react";
import { formatDate } from "~/utils/formatDate";

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
  const navigation = useNavigation();

  return (
    <>
      <h1
        style={{
          display: "inline-block",
          marginRight: "1rem",
          marginBottom: "1rem",
        }}
      >
        /{data.slug}/ - {data.name}
      </h1>
      <a href="/">Back</a>

      {!!data.threads.length && (
        <div>
          <h2>Threads:</h2>
          <ul>
            {data.threads.map((x) => (
              <li key={x.id}>
                <a href={`/boards/${data.slug}/${x.id}`}>
                  {x.message} ({x.repliesCount})
                </a>
                {x.createdAt && (
                  <span style={{ marginLeft: ".5rem" }}>
                    / created at: {formatDate(x.createdAt)}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <h2>Start a new thread</h2>
        <Form method="POST">
          <input ref={inputRef} name="message" />
          <br />
          <button disabled={navigation.state === "submitting"} type="submit">
            Send
          </button>
        </Form>
      </div>
    </>
  );
};

export default BoardPage;
