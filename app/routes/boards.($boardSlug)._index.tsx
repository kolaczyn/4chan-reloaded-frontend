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
import type { SyntheticEvent } from "react";
import { useRef } from "react";
import { formatDate } from "~/utils/formatDate";
import { getIsJannyFromCookie } from "~/utils/getIsJannyFromCookie";

const PAGE_SIZE = 6;
const DEFAULT_SORT = "replyCount";

export const loader = async ({ params, request }: DataFunctionArgs) => {
  const boardSlug = params.boardSlug;

  const searchParams = new URL(request.url).searchParams;
  const page = searchParams.get("page") ?? "1";
  const sortOrder = searchParams.get("sortOrder") ?? DEFAULT_SORT;

  const isJanny = await getIsJannyFromCookie(request);
  const res: BoardsThreadsDto = await fetch(
    `${API_URL}/${boardSlug}?page=${page}&pageSize=${PAGE_SIZE}&sortOrder=${sortOrder}`
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

  const handleSelectSort = (e: SyntheticEvent<HTMLSelectElement>) => {
    console.log(e.currentTarget.value);
    setSearchParams(
      new URLSearchParams({ page: "1", sortOrder: e.currentTarget.value })
    );
  };

  const isLoading = navigation.state === "loading";

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
          <div>
            <label>Sort by</label>
            <select onChange={handleSelectSort} name="cars" id="cars">
              <option value="replyCount">reply count</option>
              <option value="creationDate">creation date</option>
            </select>
          </div>
          <h2>Threads:</h2>
          <ul style={{ opacity: isLoading ? "55%" : "100%" }}>
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
            disabled={isFirstPage || isLoading}
            onClick={() =>
              setSearchParams(
                new URLSearchParams({ page: `${currentPage - 1}` })
              )
            }
          >
            previous page
          </button>
          <span style={{ marginLeft: ".5rem", marginRight: "0.5rem" }}>
            Current page: {currentPage}
          </span>
          <button
            disabled={isLastPage || isLoading}
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
