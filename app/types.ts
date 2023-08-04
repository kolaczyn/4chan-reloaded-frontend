export type BoardDto = {
  slug: string;
  name: string;
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

export type ThreadDto = {
  id: number;
  title: string | null;
  replies: {
    message: string;
    createdAt: string | null;
    id: number;
    imageUrl: string | null;
  }[];
};

export type SortOrderDto = "bump" | "creationDate" | "replyCount";

export type BoardsThreadsQueryDto = {
  slug: string;
  page: number;
  pageSize: number;
  sortOrder: SortOrderDto | (string & {});
};
