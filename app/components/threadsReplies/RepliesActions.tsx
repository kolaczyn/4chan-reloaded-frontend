import { AppLinkExternal } from "~/components/AppLinkExternal";

type Props = {
  rssFeedUrl: string;
  handleRefresh: () => void;
};

export const RepliesActions = ({ handleRefresh, rssFeedUrl }: Props) => (
  <div className="flex justify-between mt-2">
    <AppLinkExternal href={rssFeedUrl}>Rss Feed</AppLinkExternal>
    <button onClick={handleRefresh} className="text-blue-500">
      Refresh
    </button>
  </div>
);
