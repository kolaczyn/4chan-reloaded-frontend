import { createCookie } from "@remix-run/node";
import { JANNY_MODE_COOKIE } from "~/constants";

export const jannyCookie = createCookie(JANNY_MODE_COOKIE, {
  maxAge: 60 * 60 * 24 * 365,
});
