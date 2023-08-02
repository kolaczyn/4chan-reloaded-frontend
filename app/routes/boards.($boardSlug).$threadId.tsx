import type {
  ActionArgs,
  DataFunctionArgs,
  V2_MetaFunction,
} from "@remix-run/node";
import type { ThreadDto } from "~/types";
import { API_URL } from "~/constants";
import {
  Form,
  useLoaderData,
  useNavigation,
  useParams,
  useRevalidator,
} from "@remix-run/react";
import { useRef } from "react";
import { getIsJannyFromCookie } from "~/utils/getIsJannyFromCookie";
import { dateInfo, formatDateExtra } from "~/utils/formatDate";

export const loader = async ({ params, request }: DataFunctionArgs) => {
  const { boardSlug, threadId } = params;
  const isJanny = await getIsJannyFromCookie(request);
  const res: ThreadDto = await fetch(
    `${API_URL}/${boardSlug}/threads/${threadId}`
  ).then((res) => res.json());
  return { data: res, boardSlug, isJanny };
};

const addReplyAction = async ({ request, params }: ActionArgs) => {
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

const deleteReplyAction = async (
  boardSlug: string,
  threadId: string,
  replyId: number,
  password: string
) => {
  const res = await fetch(
    `${API_URL}/${boardSlug}/threads/${threadId}/replies/${replyId}`,
    {
      method: "delete",
      body: JSON.stringify({ password }),
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    }
  );
  return res;
};

export const action = async ({ request, params, context }: ActionArgs) => {
  if (request.method === "POST") {
    return await addReplyAction({ request, params, context });
  }
};

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
  const firstReply = data?.data.replies?.[0].message;
  return [
    {
      title: data ? `${firstReply ?? ""} - /${data.boardSlug}/` : "",
    },
    { name: "description", content: "A simple messageboard" },
  ];
};

const ThreadPage = () => {
  const params = useParams();
  const revalidator = useRevalidator();
  const { data, boardSlug, isJanny } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const passwordRef = useRef<HTMLInputElement | null>(null);

  const handleDelete = async (id: number) => {
    await deleteReplyAction(
      boardSlug ?? "",
      params.threadId ?? "-1",
      id,
      passwordRef.current?.value ?? ""
    );
    revalidator.revalidate();
  };

  return (
    <div className="max-w-2xl mx-auto py-4">
      <a
        className="text-blue-500 hover:underline"
        href={`/boards/${boardSlug}`}
      >
        Back
      </a>

      <ul className="list-disc list-inside mt-2">
        {data.replies.map((x) => (
          <li key={x.id}>
            <span
              style={{
                //   greentext
                color: x.message.startsWith(">") ? "#789922" : "initial",
              }}
            >
              {x.message}
            </span>
            {x.createdAt && (
              <span
                title={formatDateExtra(x.createdAt)}
                className="ml-2 opacity-60"
              >
                // created at: {dateInfo(x.createdAt)}
              </span>
            )}
            {isJanny && (
              <button onClick={() => handleDelete(x.id)}>Remove</button>
            )}
          </li>
        ))}
      </ul>
      <hr />
      {isJanny && (
        <>
          <input ref={passwordRef} id="password" type="password" />
          <label htmlFor="password">Password</label>
        </>
      )}
      <br />

      <div className="border-blue-100 border mt-3">
        <Form method="post">
          <input
            placeholder="Your reply..."
            name="message"
            className="bg-gray-100 my-1"
          />
          <br />
          <button
            className="bg-gray-100 hover:bg-gray-200 transition-colors px-2 py-1 cursor-pointer"
            type="submit"
            disabled={navigation.state === "submitting"}
          >
            Reply
          </button>
        </Form>
      </div>
    </div>
  );
};

export default ThreadPage;
