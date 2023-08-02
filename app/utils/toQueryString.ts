export const toQueryString = (
  query:
    | string[][]
    | Record<string, string>
    | string
    | URLSearchParams
    | Record<string, string | number>
) =>
  // @ts-expect-error: I know that Record<string, string | number works fine. This wrapper is a workaround for weird TS error
  new URLSearchParams(query);
