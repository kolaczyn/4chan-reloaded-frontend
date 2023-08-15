import { ReplyMessage } from "~/components/ReplyMessage/ReplyMessage";
import type { ReplyDto } from "~/types";
import { ReplyTitle } from "~/components/threadsReplies/ReplyTitle";
import { isGreentext } from "~/components/threadsReplies/isGreentext";

const GRADIENT = "bg-gradient-to-r from-lime-50 to-orange-50";

type Props = ReplyDto & {
  threadTitle: string | null;
  isFirst: boolean;
  handleClickId: (id: number) => void;
  isJanny: boolean;
  handleDelete: (id: number) => void;
};

export const ReplyCard = ({
  message,
  id,
  createdAt,
  imageUrl,
  threadTitle,
  isFirst,
  handleClickId,
  isJanny,
  handleDelete,
}: Props) => {
  return (
    <div className={`rounded-sm ${GRADIENT} border border-emerald-50`}>
      <span>
        {imageUrl && <img alt={threadTitle ?? undefined} src={imageUrl} />}
        <div className="px-2 py-1">
          <ReplyTitle
            id={id}
            handleDelete={handleDelete}
            createdAt={createdAt}
            handleClickId={handleClickId}
            isJanny={isJanny}
          />
          {isFirst && <b>{threadTitle} </b>}
          {message.split("\n").map((line, idx) => (
            <div
              className={isGreentext(line) ? "text-[#789922]" : ""}
              key={idx}
            >
              <ReplyMessage message={line} />
              <br />
            </div>
          ))}
        </div>
      </span>
    </div>
  );
};
