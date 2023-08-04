import type { DataFunctionArgs, V2_MetaFunction } from "@remix-run/node";
import type { BoardDto } from "~/types";
import { useLoaderData } from "@remix-run/react";
import { API_URL } from "~/constants";
import { getIsJannyFromCookie } from "~/utils/getIsJannyFromCookie";
import { BoardLink } from "~/components/Home/BoardLink";
import { HomeFooter } from "~/components/Home/HomeFooter";
import { AppContainer } from "~/components/layout/AppContainer";

export const loader = async ({ request }: DataFunctionArgs) => {
  const boards: BoardDto[] = await fetch(API_URL).then((res) => res.json());
  const isJanny = await getIsJannyFromCookie(request);

  return {
    isJanny,
    boards,
  };
};

export const meta: V2_MetaFunction = () => [
  { title: "Boards" },
  { name: "description", content: "A simple messageboard" },
];

const HomePage = () => {
  const { boards, isJanny } = useLoaderData<typeof loader>();

  return (
    <AppContainer>
      <h1 className="text-3xl">Boards</h1>
      <ul className="my-5">
        {boards.map((x) => (
          <li key={x.slug}>
            <BoardLink slug={x.slug} name={x.name} />
            {isJanny && <button disabled>Delete</button>}
          </li>
        ))}
      </ul>
      <HomeFooter isJanny={isJanny} />
    </AppContainer>
  );
};

export default HomePage;
