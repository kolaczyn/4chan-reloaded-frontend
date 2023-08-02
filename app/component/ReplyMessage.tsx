type Props = {
  message: string;
};

const isUrl = (str: string) =>
  str.startsWith("http://") || str.startsWith("https://");

export const ReplyMessage = ({ message }: Props) => {
  const words = message.split(" ");

  return words.map((x) => (
    <>
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
        x
      )}{" "}
    </>
  ));
};
