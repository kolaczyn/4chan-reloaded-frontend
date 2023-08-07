import { useState } from "react";
import { ImagePreview } from "~/components/ReplyMessage/ImagePreview";

const regExp =
  /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
const getPreviewUrl = (url: string) => {
  const match = url.match(regExp);
  const videoId = match && match[7].length === 11 ? match[7] : null;
  return `https://i.ytimg.com/vi_webp/${videoId}/mqdefault.webp`;
};

type Props = {
  embedUrl: string;
  url: string;
};

export const YoutubeEmbed = ({ embedUrl, url }: Props) => {
  const [isShowing, setIsShowing] = useState(false);
  return (
    <>
      {isShowing ? (
        <div className="-mx-2">
          <div className="aspect-w-16 aspect-h-9">
            <iframe
              width="560"
              height="315"
              src={embedUrl}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            />
          </div>{" "}
          <button className="text-blue-500" onClick={() => setIsShowing(false)}>
            [Hide]
          </button>
        </div>
      ) : (
        <span>
          <span>{url}</span>{" "}
          <ImagePreview url={getPreviewUrl(url)}>
            <button
              className="text-blue-500"
              onClick={() => setIsShowing(true)}
            >
              [Embed]
            </button>
          </ImagePreview>
        </span>
      )}
    </>
  );
};
