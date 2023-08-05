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
import { useRef, useState } from "react";
import { getIsJannyFromCookie } from "~/utils/getIsJannyFromCookie";
import { AppLink } from "~/components/AppLink";
import { RepliesActions } from "~/components/threadsReplies/RepliesActions";
import { ReplyCard } from "~/components/threadsReplies/ReplyCard";
import { Loader } from "~/components/Loader";

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
  const imageUrl = formData.get("imageUrl");

  const res = await fetch(
    `${API_URL}/${params.boardSlug}/threads/${params.threadId}/replies`,
    {
      method: "post",
      body: JSON.stringify({ message, ...(imageUrl ? { imageUrl } : {}) }),
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    }
  ).then((x) => x.json());

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
  const navigation = useNavigation();

  const { data, boardSlug, isJanny } = useLoaderData<typeof loader>();

  const passwordRef = useRef<HTMLInputElement | null>(null);
  const replyInputRef = useRef<HTMLTextAreaElement | null>(null);

  const [imageUrl, setImageUrl] = useState<string>("");

  const isLoading =
    navigation.state === "loading" || revalidator.state === "loading";

  const handleDelete = async (id: number) => {
    await deleteReplyAction(
      boardSlug ?? "",
      params.threadId ?? "-1",
      id,
      passwordRef.current?.value ?? ""
    );
    revalidator.revalidate();
  };

  const handleClickId = (id: number) => {
    if (!replyInputRef.current) return;
    replyInputRef.current.value = `>>${id} `;

    replyInputRef.current.focus();
  };

  return (
    <div className="max-w-2xl mx-auto py-4">
      <AppLink href={`/boards/${boardSlug}`}>Back</AppLink>
      <ul className="mt-2">
        <Loader isLoading={isLoading}>
          {data.replies.map((x, idx) => (
            <li
              id={`${x.id}` ?? undefined}
              className="mt-4"
              key={`${x.id}-${idx === 0}`}
            >
              <ReplyCard
                {...x}
                isJanny={isJanny}
                isFirst={idx === 0}
                threadTitle={data.title}
                handleDelete={() => handleDelete(x.id)}
                handleClickId={() => handleClickId(x.id)}
              />
            </li>
          ))}
        </Loader>
      </ul>
      <hr />
      {isJanny && (
        <>
          <input ref={passwordRef} id="password" type="password" />
          <label htmlFor="password">Password</label>
        </>
      )}

      <RepliesActions
        rssFeedUrl={`https://api.kolaczyn.com/${boardSlug}/${data.id}`}
        handleRefresh={() => revalidator.revalidate()}
      />

      <div className="grid grid-cols-2 gap-2.5">
        <Form method="post">
          <input
            placeholder="Image url"
            className="py-1 px-2 w-full"
            name="imageUrl"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
          <textarea
            ref={replyInputRef}
            placeholder="Your reply..."
            name="message"
            rows={3}
            className="my-1 w-full bg-gray-50 p-2"
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

        {imageUrl ? (
          <img
            alt="The image could not be loaded. Make sure the link is okay"
            src={imageUrl}
            className="max-w-xs aspect-auto max-h-40"
          />
        ) : (
          <div />
        )}
      </div>
    </div>
  );
};

export default ThreadPage;
