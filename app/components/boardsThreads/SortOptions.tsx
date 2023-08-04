import type { SyntheticEvent } from "react";

type Props = {
  handleSelectSort: (e: SyntheticEvent<HTMLSelectElement>) => void;
};

export const SortOptions = ({ handleSelectSort }: Props) => (
  <select
    className="mb-2 bg-gray-100 p-1 hover:bg-gray-200 transition-colors cursor-pointer"
    onChange={handleSelectSort}
  >
    <option value="bump">Sort by bump order</option>
    <option value="replyCount">Sort by reply count</option>
    <option value="creationDate">Sort by creation date</option>
  </select>
);
