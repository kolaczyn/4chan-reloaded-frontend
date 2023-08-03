import { Fragment } from "react";

type Props = {
  message: string;
};

const isUrl = (str: string) =>
  str.startsWith("http://") || str.startsWith("https://");

export const ReplyMessage = ({ message }: Props) => {
  const words = message.split(" ");

  // using idx as key - not perfect but good enough for now
  return words.map((x, idx) => (
    <Fragment key={idx}>
      {isUrl(x) ? (
        <a
          target="_blank"
          rel="noreferrer"
          className="text-blue-500 hover:underline"
          href={x}
        >
          {x}
        </a>
      ) : (
        <span>{x}</span>
      )}{" "}
    </Fragment>
  ));
};
