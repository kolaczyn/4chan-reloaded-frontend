import type { ActionArgs, DataFunctionArgs } from "@remix-run/node";
import type { ThreadDto } from "~/types";
import { API_URL } from "~/constants";
import { Form, useLoaderData, useNavigation } from "@remix-run/react";
import { useRef } from "react";
import { formatDate } from "~/utils/formatDate";

export const loader = async ({ params }: DataFunctionArgs) => {
  const { boardSlug, threadId } = params;
  const res: ThreadDto = await fetch(
    `${API_URL}/${boardSlug}/threads/${threadId}`
  ).then((res) => res.json());
  return { data: res, boardSlug };
};

export const action = async ({ request, params }: ActionArgs) => {
  const formData = await request.formData();
  const message = formData.get("message");

  const res = await fetch(
    `${API_URL}/${params.boardSlug}/threads/${params.threadId}/replies`,
    {
      method: "post",
      body: JSON.stringify({ message }),
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    }
  ).then((res) => res.json());

  return res;
};

const ThreadPage = () => {
  const { data, boardSlug } = useLoaderData<typeof loader>();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const navigation = useNavigation();
  return (
    <div>
      <a href={`/boards/${boardSlug}`}>Back</a>

      <ul>
        {data.replies.map((x, idx) => (
          <li key={idx}>
            <span>{x.message}</span>
            {x.createdAt && (
              <span style={{ marginLeft: ".5rem", color: "rebeccapurple" }}>
                / created at: {formatDate(x.createdAt)}
              </span>
            )}
          </li>
        ))}
      </ul>
      <hr />

      <Form method="post">
        <input name="message" ref={inputRef} />
        <button type="submit" disabled={navigation.state === "submitting"}>
          Reply
        </button>
      </Form>
    </div>
  );
};

export default ThreadPage;
