import { Fragment } from "react";
import * as url from "url";
import is from "@sindresorhus/is";
import regExp = is.regExp;

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

export const ReplyMessage = ({ message }: Props) => {
  const words = message.split(" ");

  // using idx as key - not perfect but good enough for now
  return words.map((x, idx) => {
    const isUrl = checkIfIsUrl(x);
    const youtubeEmbeded = convertToEmbeddedUrl(x);
    if (youtubeEmbeded) {
      return (
        <iframe
          key={idx}
          width="373"
          height="210"
          src={youtubeEmbeded}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      );
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
          {x}
        </a>
      );
    }
    return <span>{x}</span>;
  });
};
