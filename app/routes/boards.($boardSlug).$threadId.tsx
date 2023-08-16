import type {
  ActionArgs,
  DataFunctionArgs,
  V2_MetaFunction,
} from "@remix-run/node";
import type { ThreadDto } from "~/types";
import { API_URL_V1 } from "~/constants";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
  useParams,
  useRevalidator,
} from "@remix-run/react";
import { useRef, useState } from "react";
import { getIsJannyFromCookie } from "~/utils/getIsJannyFromCookie";
import { AppLink } from "~/components/ui/AppLink";
import { RepliesActions } from "~/components/threadsReplies/RepliesActions";
import { ReplyCard } from "~/components/threadsReplies/ReplyCard";
import { Loader } from "~/components/ui/Loader";
import { urlPattern } from "~/utils/urlPattern";

type ValidationErrors = {
  message: string | null;
  imageUrl: string | null;
};

export const loader = async ({ params, request }: DataFunctionArgs) => {
  const { boardSlug, threadId } = params;
  const isJanny = await getIsJannyFromCookie(request);
  const res: ThreadDto = await fetch(
    `${API_URL_V1}/${boardSlug}/threads/${threadId}`
  ).then((res) => res.json());
  return { data: res, boardSlug, isJanny };
};

const addReplyAction = async ({ request, params }: ActionArgs) => {
  const formData = await request.formData();
  const message = formData.get("message") ?? "";
  const imageUrl = formData.get("imageUrl");

  let errs: ValidationErrors = {
    message: null,
    imageUrl: null,
  };
  if (message === "") {
    errs.message = "Message can't be empty";
  }

  // image is optional, but if it's provided, it needs to be validated
  if (imageUrl !== "" && !urlPattern.test(imageUrl as string)) {
    errs.imageUrl = "Image URL is not valid";
  }

  if (errs.message || errs.imageUrl) {
    return {
      status: 400,
      json: errs,
    };
  }

  const res = await fetch(
    `${API_URL_V1}/${params.boardSlug}/threads/${params.threadId}/replies`,
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
    `${API_URL_V1}/${boardSlug}/threads/${threadId}/replies/${replyId}`,
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
  const actionData = useActionData<typeof action>();
  const revalidator = useRevalidator();
  const navigation = useNavigation();

  const { data, boardSlug, isJanny } = useLoaderData<typeof loader>();

  const passwordRef = useRef<HTMLInputElement | null>(null);
  const replyInputRef = useRef<HTMLTextAreaElement | null>(null);

  const [messageText, setMessageText] = useState("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const $form = useRef<HTMLFormElement | null>(null);

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
      <div className="space-x-3 flex mb-3 items-center font-bold">
        <div className="text-2xl">
          <AppLink href="/">Boards</AppLink>
        </div>
        <div className="text-xl">›</div>
        <AppLink href={`/boards/${boardSlug}`}>/{boardSlug}/</AppLink>
        <div className="text-xl">›</div>
        <div>Thread #{data.id}</div>
      </div>

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

      <Form ref={$form} method="post">
        <label htmlFor="imageUrl" className="font-medium mr-2 block mt-2">
          Image url: <span className="text-gray-400 text-sm">(optional)</span>
        </label>
        <input
          placeholder="Image url"
          className="py-1 px-2 w-full mt-2"
          id="imageUrl"
          name="imageUrl"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        {actionData?.json?.imageUrl && (
          <div className="text-red-400 text-sm mt-1">
            {actionData.json.imageUrl}
          </div>
        )}

        <label htmlFor="message" className="font-medium mr-2 block mt-2">
          Message: <span className="text-gray-400 text-sm">(required)</span>
        </label>
        <textarea
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder="Your reply..."
          id="message"
          name="message"
          rows={3}
          className="my-1 w-full bg-gray-50 p-2 mt-2"
        />
        {actionData?.json?.message && (
          <div className="text-red-400 text-sm">{actionData.json.message}</div>
        )}

        <button
          className="bg-blue-100 rounded-sm hover:bg-blue-200 transition-colors px-2 py-1 cursor-pointer mt-2"
          type="submit"
          disabled={navigation.state === "submitting"}
        >
          Reply
        </button>
      </Form>

      {(messageText || imageUrl) && (
        <div className="mb-32 mt-4">
          <div className="font-medium mb-2">Preview:</div>
          <ReplyCard
            tripcode="Anonymous"
            message={messageText}
            createdAt={null}
            id={1234}
            imageUrl={imageUrl}
            threadTitle={""}
            isFirst={false}
            handleClickId={() => {}}
            isJanny={false}
            handleDelete={() => {}}
          />
        </div>
      )}
    </div>
  );
};

export default ThreadPage;
