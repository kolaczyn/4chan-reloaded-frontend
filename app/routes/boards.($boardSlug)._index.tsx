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
import { getIsJannyFromCookie } from "~/utils/getIsJannyFromCookie";
import { toQueryString } from "~/utils/toQueryString";
import { useState } from "react";
import { redirect } from "@remix-run/node";
import { AppContainer } from "~/components/layout/AppContainer";
import { SortOptions } from "~/components/boardsThreads/SortOptions";
import { Pagination } from "~/components/boardsThreads/Pagination";
import { ThreadTeaser } from "~/components/boardsThreads/ThreadTeaser";
import { AppLink } from "~/components/AppLink";
import { AppLinkExternal } from "~/components/AppLinkExternal";
import { Loader } from "~/components/Loader";

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
  const [imageUrl, setImageUrl] = useState("");

  const currentPage = parseInt(searchParams.get("page") ?? "1", 10);

  const isFirstPage = currentPage === 1;
  const isLastPage = data.threads.length < PAGE_SIZE;
  const sortOrder = searchParams.get("sortOrder") ?? DEFAULT_SORT;

  const handleSelectSort = (e: SyntheticEvent<HTMLSelectElement>) => {
    setSearchParams(
      new URLSearchParams({ page: "1", sortOrder: e.currentTarget.value })
    );
  };

  const handleSetPage = (page: number) => {
    const newSearchParams = new URLSearchParams({
      page: `${page}`,
      sortOrder,
    });
    setSearchParams(newSearchParams);
  };

  const isLoading = navigation.state === "loading";

  return (
    <AppContainer>
      <div className="space-x-3 flex mb-3">
        <h1>
          /{data.slug}/ - {data.name}
        </h1>
        <AppLink href="/">Back</AppLink>
      </div>

      {!!data.threads.length && (
        <>
          <div className="flex justify-between mb-2">
            <h2 className="text-3xl">Threads:</h2>
            <SortOptions handleSelectSort={handleSelectSort} />
          </div>
          <Pagination
            isLastPage={isLastPage}
            currentPage={currentPage}
            handleSetPage={handleSetPage}
            isFirstPage={isFirstPage}
            isLoading={isLoading}
          />

          <ul>
            <Loader isLoading={isLoading}>
              {data.threads.map((x) => (
                <li key={x.id}>
                  <ThreadTeaser {...x} isJanny={isJanny} slug={data.slug} />
                </li>
              ))}
            </Loader>
          </ul>
        </>
      )}
      <hr className="my-3" />
      <AppLinkExternal href={`https://api.kolaczyn.com/${data.slug}`}>
        Rss Feed
      </AppLinkExternal>
      <hr className="mt-3" />

      <div className="mt-3 grid grid-cols-2 gap-2.5">
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
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
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
    </AppContainer>
  );
};

export default BoardPage;
