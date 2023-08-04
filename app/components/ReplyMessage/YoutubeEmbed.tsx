import { useState } from "react";

type Props = {
  embedUrl: string;
  url: string;
};

export const YoutubeEmbed = ({ embedUrl, url }: Props) => {
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
