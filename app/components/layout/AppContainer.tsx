import type { ReactNode } from "react";
import { AppFooter } from "~/components/Home/AppFooter";

type Props = {
  children: ReactNode;
};

export const AppContainer = ({ children }: Props) => (
  <div className="max-w-2xl mx-auto pt-4">
    <div>{children}</div>
    <AppFooter />
  </div>
);
