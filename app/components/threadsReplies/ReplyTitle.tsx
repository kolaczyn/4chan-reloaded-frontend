import { dateInfo, formatDateExtra } from "~/utils/formatDate";
import { truncateStr } from "~/utils/truncateStr";

type Props = {
  id: number;
  createdAt: string | null;
  handleClickId: (id: number) => void;
  isJanny: boolean;
  handleDelete: (id: number) => void;
  tripcode: string | null;
};

export const ReplyTitle = ({
  id,
  handleDelete,
  createdAt,
  handleClickId,
  isJanny,
  tripcode,
}: Props) => {
  return (
    <div className="mt-1 mb-3 opacity-60">
      <span title={tripcode ?? undefined}>
        {tripcode ? truncateStr(tripcode, 16) : "Anonymous"}{" "}
      </span>
      <span className="cursor-pointer" onClick={() => handleClickId(id)}>
        (no. {id}
      </span>
      {createdAt && (
        <span title={formatDateExtra(createdAt)}>, {dateInfo(createdAt)}</span>
      )}
      <span>)</span>
      {isJanny && <button onClick={() => handleDelete(id)}>Remove</button>}
    </div>
  );
};
