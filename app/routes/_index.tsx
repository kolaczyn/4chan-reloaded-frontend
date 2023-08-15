import type { DataFunctionArgs, V2_MetaFunction } from "@remix-run/node";
import type { CategoriesBoardsDto } from "~/types";
import { useLoaderData } from "@remix-run/react";
import { API_URL_V2 } from "~/constants";
import { getIsJannyFromCookie } from "~/utils/getIsJannyFromCookie";
import { BoardLink } from "~/components/Home/BoardLink";
import { AppContainer } from "~/components/layout/AppContainer";

export const loader = async ({ request }: DataFunctionArgs) => {
  const boards: CategoriesBoardsDto[] = await fetch(API_URL_V2).then((res) =>
    res.json()
  );
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
      <h1 className="text-2xl font-bold">Boards</h1>
      <ul className="my-3 grid grid-cols-2">
        {boards.map((x) => (
          <li key={x.id}>
            <ul>
              <li className="font-bold mb-1 mt-2">{x.name}</li>
              {x.boards.map((y) => (
                <li key={y.slug}>
                  <BoardLink slug={y.slug} name={y.name} />
                  {isJanny && <button disabled>Delete</button>}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </AppContainer>
  );
};

export default HomePage;
