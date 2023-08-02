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
import type {
  BoardsThreadsDto,
  BoardsThreadsQueryDto,
  SortOrderDto,
} from "~/types";
import type { SyntheticEvent } from "react";
import { useRef } from "react";
import { dateInfo, formatDateExtra } from "~/utils/formatDate";
import { getIsJannyFromCookie } from "~/utils/getIsJannyFromCookie";
import { toQueryString } from "~/utils/toQueryString";

const PAGE_SIZE = 6;
const DEFAULT_SORT: SortOrderDto = "bump";

export const loader = async ({ params, request }: DataFunctionArgs) => {
  const boardSlug = params.boardSlug;
  if (!boardSlug) {
    return;
  }

  const searchParams = new URL(request.url).searchParams;
  const page = searchParams.get("page") ?? "1";
  const sortOrder = searchParams.get("sortOrder") ?? DEFAULT_SORT;

  const isJanny = await getIsJannyFromCookie(request);
  const query: BoardsThreadsQueryDto = {
    slug: boardSlug,
    page: Number(page),
    pageSize: Number(PAGE_SIZE),
    sortOrder,
  };
  const res: BoardsThreadsDto = await fetch(
    `${API_URL}/${boardSlug}?${toQueryString(query)}`
  ).then((res) => res.json());
  return { isJanny, boardsThreads: res };
};

export const action = async ({ request, params }: ActionArgs) => {
  const formData = await request.formData();
  const message = formData.get("message");

  return await fetch(`${API_URL}/${params.boardSlug}/threads`, {
    method: "post",
    body: JSON.stringify({ message }),
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  }).then((res) => res.json());
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
    setSearchParams(
      new URLSearchParams({ page: "1", sortOrder: e.currentTarget.value })
    );
  };

  const isLoading = navigation.state === "loading";

  return (
    <div className="max-w-2xl mx-auto py-4">
      <div className="space-x-3 flex mb-3">
        <h1>
          /{data.slug}/ - {data.name}
        </h1>
        <a className="text-blue-500 hover:underline" href="/">
          Back
        </a>
      </div>

      {!!data.threads.length && (
        <>
          <div className={"flex justify-between mb-2"}>
            <h2 className="text-3xl">Threads:</h2>
            <select
              className="mb-2 bg-gray-100 p-1 hover:bg-gray-200 transition-colors cursor-pointer"
              onChange={handleSelectSort}
              name="cars"
              id="cars"
            >
              <option value="bump">Sort by bump order</option>
              <option value="replyCount">Sort by reply count</option>
              <option value="creationDate">Sort by creation date</option>
            </select>
          </div>
          <ul style={{ opacity: isLoading ? "55%" : "100%" }}>
            {data.threads.map((x) => (
              <li key={x.id}>
                <a
                  className={"font-bold text-blue-500 hover:underline"}
                  href={`/boards/${data.slug}/${x.id}`}
                >
                  {x.message} ({x.repliesCount})
                </a>
                {x.createdAt && (
                  <span
                    title={formatDateExtra(x.createdAt)}
                    className="ml-2 opacity-60"
                  >
                    // {dateInfo(x.createdAt)}
                  </span>
                )}
                {isJanny && <button disabled>Delete</button>}
              </li>
            ))}
          </ul>
          <hr className="my-3" />
          <button
            className="bg-gray-100 hover:bg-gray-200 transition-colors px-2 py-1 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isFirstPage || isLoading}
            onClick={() =>
              setSearchParams(
                new URLSearchParams({ page: `${currentPage - 1}` })
              )
            }
          >
            Previous
          </button>
          <span className="mx-2">Current page: {currentPage}</span>
          <button
            className="bg-gray-100 hover:bg-gray-200 transition-colors px-2 py-1 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLastPage || isLoading}
            onClick={() =>
              setSearchParams(
                new URLSearchParams({ page: `${currentPage + 1}` })
              )
            }
          >
            Next
          </button>
        </>
      )}

      <div className="border-blue-100 border mt-3">
        <h2 className="font-medium">Start a new thread</h2>
        <Form method="POST">
          <input
            className="bg-gray-100 my-1"
            placeholder="Your message..."
            ref={inputRef}
            name="message"
          />
          <br />
          <button
            className="bg-gray-100 hover:bg-gray-200 transition-colors px-2 py-1 cursor-pointer"
            disabled={navigation.state === "submitting"}
            type="submit"
          >
            Send
          </button>
        </Form>
      </div>
    </div>
  );
};

export default BoardPage;
