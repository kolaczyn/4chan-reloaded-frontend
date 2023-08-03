import { useState } from "react";

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

export const ReplyMessage = ({ message }: Props) => {
  const words = message.split(" ");

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
    const isBold = x.startsWith("*") && x.endsWith("*");
    return (
      <span key={idx} className={isBold ? "font-bold" : ""}>
        {x}{" "}
      </span>
    );
  });
};
