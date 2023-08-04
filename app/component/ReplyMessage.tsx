import { useEffect, useState } from "react";
import * as Tooltip from "@radix-ui/react-tooltip";

type Props = {
  message: string;
};

const checkIfIsUrl = (str: string) =>
  str.startsWith("http://") || str.startsWith("https://");

const convertToEmbeddedUrl = (url: string) => {
  const regExp =
    /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
  const match = url.match(regExp);
  const videoID = match && match[7].length === 11 ? match[7] : null;

  if (videoID) {
    return `https://www.youtube.com/embed/${videoID}`;
  } else {
    return null;
  }
};

const YoutubeEmbed = ({ embedUrl, url }: { embedUrl: string; url: string }) => {
  const [isShowing, setIsShowing] = useState(false);
  return (
    <>
      {isShowing ? (
        <>
          <iframe
            width="560"
            height="315"
            src={embedUrl}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
          <button className="text-blue-500" onClick={() => setIsShowing(false)}>
            {" "}
            [Hide]
          </button>
        </>
      ) : (
        <span>
          <span>{url}</span>
          <button className="text-blue-500" onClick={() => setIsShowing(true)}>
            {" "}
            [Embed]
          </button>
        </span>
      )}
    </>
  );
};

const ReplyText = ({ text }: { text: string }) => {
  const [replyText, setReplyText] = useState<string | null>(null);
  const isBold = text.startsWith("*") && text.endsWith("*");

  const isQuote = text.startsWith(">>");
  const quoteId = text.replace(">>", "");
  const isGreentext = text.startsWith(">") && !isQuote;

  useEffect(() => {
    console.log(">", quoteId, "<");
    const element = document.getElementById(quoteId);
    if (!element) {
      setReplyText("__not__found__");
      return;
    }

    setReplyText(element?.innerText ?? null);
  }, [quoteId]);

  const getColor = () => {
    if (isQuote) return "#d00";
    if (isGreentext) return "#789922";
    return "";
  };

  if (!isQuote) {
    return (
      <span style={{ color: getColor() }} className={isBold ? "font-bold" : ""}>
        {text}{" "}
      </span>
    );
  }

  if (replyText === "__not__found__") {
    return (
      <span
        style={{ color: getColor() }}
        className={[
          isBold ? "font-bold" : "",
          replyText === "__not__found__" ? "line-through" : "",
        ].join(" ")}
      >
        {text}{" "}
      </span>
    );
  }

  return (
    <Tooltip.Provider>
      <Tooltip.Root delayDuration={125}>
        <Tooltip.Trigger asChild>
          <span
            onClick={() => {
              document.getElementById(quoteId)?.scrollIntoView();
            }}
            style={{ color: getColor() }}
            className={isBold ? "font-bold" : ""}
          >
            {text}{" "}
          </span>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="bg-amber-50 px-2 py-0.5 rounded-sm bg-opacity-70"
            sideOffset={5}
          >
            {replyText}
            <Tooltip.Arrow className="bg-opacity-70 fill-amber-50" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};

export const ReplyMessage = ({ message }: Props) => {
  const words = message.split(/\s+|\n+/);

  // using idx as key - not perfect but good enough for now
  return words.map((x, idx) => {
    const isUrl = checkIfIsUrl(x);
    const youtubeEmbeded = convertToEmbeddedUrl(x);
    if (youtubeEmbeded) {
      return <YoutubeEmbed url={x} embedUrl={youtubeEmbeded} key={idx} />;
    }
    if (isUrl) {
      return (
        <a
          key={idx}
          target="_blank"
          rel="noreferrer"
          className="text-blue-500 hover:underline"
          href={x}
        >
          {x}{" "}
        </a>
      );
    }

    return <ReplyText text={x} key={idx} />;
  });
};
