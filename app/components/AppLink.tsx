import { ReactNode } from "react";

export type Props = {
  children: ReactNode;
  href: string;
};

export const AppLink = ({ children, href }: Props) => (
  <a className="text-blue-500 hover:underline" href={href}>
    {children}
  </a>
);
