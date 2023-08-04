import { Form, useNavigation } from "@remix-run/react";
import { useRef } from "react";
import type { ActionArgs } from "@remix-run/node";
import { API_URL } from "~/constants";
import { jannyCookie } from "~/routes/jannyCookie";

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const slug = formData.get("slug");
  const name = formData.get("name");
  const password = formData.get("password");

  await fetch(API_URL, {
    method: "post",
    body: JSON.stringify({ slug, name, password }),
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });

  const cookie = await jannyCookie.serialize("true");

  return new Response(null, {
    headers: {
      "Set-Cookie": cookie,
    },
  });
};

const JannyPage = () => {
  const slugInputRef = useRef<HTMLInputElement | null>(null);
  const nameInputRef = useRef<HTMLInputElement | null>(null);
  const passwordInputRef = useRef<HTMLInputElement | null>(null);

  const navigation = useNavigation();

  return (
    <Form method="POST">
      <label htmlFor="slug-input">Slug</label>
      <input id="slug-input" name="slug" ref={slugInputRef} />
      <br />
      <label htmlFor="name-input">Name</label>
      <input id="name-input" name="name" ref={nameInputRef} />
      <br />
      <label htmlFor="password-input">Password</label>
      <input
        id="password-input"
        name="password"
        ref={passwordInputRef}
        type="password"
      />
      <button disabled={navigation.state === "submitting"} type="submit">
        Submit
      </button>
    </Form>
  );
};
export default JannyPage;
