import { AppLink } from "~/components/ui/AppLink";

type Props = {
  isJanny: boolean;
};

export const HomeFooter = ({ isJanny }: Props) => (
  <div className="space-x-3">
    <AppLink href="/changelog">Changelog</AppLink>
    <AppLink href="/about">About</AppLink>
    {isJanny && <a href="/janny">Go to panel</a>}
  </div>
);
