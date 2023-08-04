import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export const AppContainer = ({ children }: Props) => (
  <div className="max-w-2xl mx-auto py-4">{children}</div>
);
