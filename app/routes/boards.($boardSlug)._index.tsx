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
import { dateInfo, formatDateExtra } from "~/utils/formatDate";
import { getIsJannyFromCookie } from "~/utils/getIsJannyFromCookie";
import { toQueryString } from "~/utils/toQueryString";
import { useState } from "react";
import { redirect } from "@remix-run/node";

const PAGE_SIZE = 24;
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

const urlPattern =
  /(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;

export const action = async ({ request, params }: ActionArgs) => {
  const formData = await request.formData();
  const message = formData.get("message");
  const title = formData.get("title") || undefined;
  const imageUrl = formData.get("image-url") || undefined;

  if (!message || !title || !imageUrl) return null;
  if (!urlPattern.test(imageUrl as string)) return null;

  const result = await fetch(`${API_URL}/${params.boardSlug}/threads`, {
    method: "post",
    body: JSON.stringify({ message, title, imageUrl }),
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  }).then((x) => x.json());

  return redirect(`/boards/${params.boardSlug}/${result.id}`);
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
  const navigation = useNavigation();
  const [imageInputText, setImageInputText] = useState("");

  const currentPage = parseInt(searchParams.get("page") ?? "1", 10);

  const isFirstPage = currentPage === 1;
  const isLastPage = data.threads.length < PAGE_SIZE;
  const sortOrder = searchParams.get("sortOrder") ?? DEFAULT_SORT;

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
          <div className="flex mb-3">
            <div className="inline-block mx-auto">
              <button
                className="bg-gray-100 hover:bg-gray-200 transition-colors px-2 py-1 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isFirstPage || isLoading}
                onClick={() =>
                  setSearchParams(
                    new URLSearchParams({
                      page: `${currentPage - 1}`,
                      sortOrder,
                    })
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
                    new URLSearchParams({
                      page: `${currentPage + 1}`,
                      sortOrder,
                    })
                  )
                }
              >
                Next
              </button>
            </div>
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
        </>
      )}

      <hr className="my-3" />
      <a
        className="text-blue-500 hover:underline"
        target="_blank"
        rel="noreferrer"
        href={`https://api.kolaczyn.com/${data.slug}`}
      >
        Rss Feed
      </a>
      <hr className="mt-3" />

      <div className="mt-3 grid grid-cols-2">
        <div>
          <h2 className="font-medium mb-2 text-lg">Start a new thread</h2>
          <Form method="POST">
            <label htmlFor="title" className="font-medium mr-2 block">
              Title: <span className="text-gray-400 text-sm">(required)</span>
            </label>
            <input
              id="title"
              className="bg-gray-100 my-1 d-block"
              name="title"
            />
            <label htmlFor="image-url" className="font-medium mr-2 block">
              Image url:{" "}
              <span className="text-gray-400 text-sm">(required)</span>
            </label>
            <input
              id="image-url"
              className="bg-gray-100 my-1 d-block"
              name="image-url"
              value={imageInputText}
              onChange={(e) => setImageInputText(e.target.value)}
            />
            <br />
            <label htmlFor="message" className={"font-medium mr-2 block"}>
              Message: <span className="text-gray-400 text-sm">(required)</span>
            </label>
            <textarea className="bg-gray-100 my-1" name="message" />
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
        {!!imageInputText ? (
          <img
            alt="Your image"
            src={imageInputText}
            className="max-w-xs aspect-auto max-h-40"
          />
        ) : (
          <div />
        )}
      </div>
    </div>
  );
};

export default BoardPage;
