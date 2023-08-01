import { jannyCookie } from "~/routes/jannyCookie";

export const getIsJannyFromCookie = async (request: Request) => {
  const cookieHeader = request.headers.get("Cookie");
  const value = await jannyCookie.parse(cookieHeader);
  return !!value;
};
