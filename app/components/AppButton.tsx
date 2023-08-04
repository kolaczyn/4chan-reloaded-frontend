import type { ReactNode } from "react";

type Props = {
  disabled?: boolean;
  children: ReactNode;
  onClick: () => void;
};

export const AppButton = ({ children, onClick, disabled = false }: Props) => (
  <button
    className="bg-gray-100 hover:bg-gray-200 transition-colors px-2 py-1 disabled:opacity-50 disabled:cursor-not-allowed"
    disabled={disabled}
    onClick={onClick}
  >
    {children}
  </button>
);
