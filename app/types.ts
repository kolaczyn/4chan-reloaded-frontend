export type BoardDto = {
  slug: string;
  name: string;
};

export type CategoriesBoardsDto = {
  id: number;
  name: string;
  boards: BoardDto[];
};

export type ThreadTeaserDto = {
  id: number;
  message: string;
  repliesCount: number;
  createdAt: string | null;
  imageUrl: string | null;
};

export type BoardsThreadsDto = {
  slug: string;
  name: string;
  threads: ThreadTeaserDto[];
};

export type ReplyDto = {
  message: string;
  createdAt: string | null;
  id: number;
  imageUrl: string | null;
};

export type ThreadDto = {
  id: number;
  title: string | null;
  replies: ReplyDto[];
};

export type SortOrderDto = "bump" | "creationDate" | "replyCount";

export type BoardsThreadsQueryDto = {
  slug: string;
  page: number;
  pageSize: number;
  sortOrder: SortOrderDto | (string & {});
};
