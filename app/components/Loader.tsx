import type { ReactNode } from "react";

type Props = {
  isLoading: boolean;
  children: ReactNode;
};

export const Loader = ({ children, isLoading }: Props) => (
  <div style={{ opacity: isLoading ? "55%" : "100%" }}>{children}</div>
);
