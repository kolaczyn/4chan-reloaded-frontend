import { ReactNode } from "react";

export type Props = {
  children: ReactNode;
  href: string;
};

export const AppLinkExternal = ({ children, href }: Props) => (
  <a
    className="text-blue-500 hover:underline"
    href={href}
    target="_blank"
    rel="noreferrer"
  >
    {children}
  </a>
);
