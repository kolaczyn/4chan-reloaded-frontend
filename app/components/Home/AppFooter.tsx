import { AppLink } from "~/components/ui/AppLink";
import { AppLinkExternal } from "~/components/ui/AppLinkExternal";

type Props = {
  isJanny?: boolean;
};

export const AppFooter = ({ isJanny = false }: Props) => (
  <div className="text-center">
    <hr className="my-2" />
    <div className="space-x-2 inline-block mx-auto mb-2">
      <AppLink href="/changelog">Changelog</AppLink>
      <span>⸱</span>
      <AppLink href="/about">About</AppLink>
      <span>⸱</span>
      <AppLinkExternal href="https://github.com/kolaczyn/boards-frontend/issues/new">
        Feature Request
      </AppLinkExternal>
      {isJanny && <a href="/janny">Go to panel</a>}
    </div>
  </div>
);
