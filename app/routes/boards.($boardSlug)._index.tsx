import { API_URL } from "~/constants";
import type {
  ActionArgs,
  DataFunctionArgs,
  V2_MetaFunction,
} from "@remix-run/node";
import {
  Form,
  useLoaderData,
  useNavigation,
  useSearchParams,
} from "@remix-run/react";
import type { BoardsThreadsDto } from "~/types";
import { useRef } from "react";
import { formatDate } from "~/utils/formatDate";
import { getIsJannyFromCookie } from "~/utils/getIsJannyFromCookie";

const PAGE_SIZE = 6;

export const loader = async ({ params, request }: DataFunctionArgs) => {
  const boardSlug = params.boardSlug;
  const page = new URL(request.url).searchParams.get("page") ?? "1";
  const isJanny = await getIsJannyFromCookie(request);
  const res: BoardsThreadsDto = await fetch(
    `${API_URL}/${boardSlug}?page=${page}&pageSize=${PAGE_SIZE}`
  ).then((res) => res.json());
  return { isJanny, boardsThreads: res };
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

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
  const x = data?.boardsThreads;
  return [
    {
      title: x ? `/${x.slug}/ - ${x.name}` : "",
    },
  ];
};

const BoardPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { boardsThreads: data, isJanny } = useLoaderData<typeof loader>();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const navigation = useNavigation();

  const currentPage = parseInt(searchParams.get("page") ?? "1", 10);

  const isFirstPage = currentPage === 1;
  const isLastPage = data.threads.length < PAGE_SIZE;

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
        <>
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
                {isJanny && <button disabled>Delete</button>}
              </li>
            ))}
          </ul>
          <button
            disabled={isFirstPage}
            onClick={() =>
              setSearchParams(
                new URLSearchParams({ page: `${currentPage - 1}` })
              )
            }
          >
            previous page
          </button>
          <button
            disabled={isLastPage}
            onClick={() =>
              setSearchParams(
                new URLSearchParams({ page: `${currentPage + 1}` })
              )
            }
          >
            next page
          </button>
        </>
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
