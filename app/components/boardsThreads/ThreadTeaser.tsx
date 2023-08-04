import type { ThreadTeaserDto } from "~/types";
import { dateInfo, formatDateExtra } from "~/utils/formatDate";

type Props = ThreadTeaserDto & {
  slug: string | null;
  isJanny: boolean;
};

export const ThreadTeaser = ({
  id,
  message,
  repliesCount,
  createdAt,
  slug,
  isJanny,
}: Props) => {
  return (
    <>
      <a
        className={"font-bold text-blue-500 hover:underline"}
        href={`/boards/${slug}/${id}`}
      >
        {message} ({repliesCount})
      </a>
      {createdAt && (
        <span title={formatDateExtra(createdAt)} className="ml-2 opacity-60">
          // {dateInfo(createdAt)}
        </span>
      )}
      {isJanny && <button disabled>Delete</button>}
    </>
  );
};
