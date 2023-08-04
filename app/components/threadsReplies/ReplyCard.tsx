import { ReplyMessage } from "~/components/ReplyMessage/ReplyMessage";
import { dateInfo, formatDateExtra } from "~/utils/formatDate";
import type { ReplyDto } from "~/types";

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
    <>
      <span>
        {imageUrl && <img alt={threadTitle ?? undefined} src={imageUrl} />}
        {isFirst && <b>{threadTitle} </b>}
        <ReplyMessage message={message} />
      </span>
      <span
        className="opacity-60 cursor-pointer"
        onClick={() => handleClickId(id)}
      >
        (no. {id}
      </span>
      {createdAt && (
        <span title={formatDateExtra(createdAt)} className="opacity-60">
          , {dateInfo(createdAt)}
        </span>
      )}
      <span className="opacity-50">)</span>
      {isJanny && <button onClick={() => handleDelete(id)}>Remove</button>}
      <hr />
    </>
  );
};
