export type BoardsListDto = {
  slug: string;
  name: string;
}[];

export type BoardsThreadsDto = {
  slug: string;
  name: string;
  threads: {
    id: number;
    message: string;
    repliesCount: number;
    createdAt: string | null;
  }[];
};

export type ThreadDto = {
  id: number;
  replies: { message: string; createdAt: string | null; id: number }[];
};
