import { ReactNode } from "react";

interface GetNumButtonProps {
  children: ReactNode;
  onClick: () => void;
}

export default function GetNumButton({ children, onClick }: GetNumButtonProps) {
  return (
    <button
      onClick={onClick}
      className="m-3 w-full rounded-full border-2 bg-white bg-opacity-5 p-6 text-center text-2xl"
    >
      {children}
    </button>
  );
}
