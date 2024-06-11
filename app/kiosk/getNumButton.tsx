import { ReactNode } from "react";

interface GetNumButtonProps {
  children: ReactNode;
  onClick: (category: string) => void;
  category: string;
}

export default function GetNumButton({ children, onClick, category}: GetNumButtonProps) {
  return (
    <button
      onClick={() => {onClick(category)}}
      className="m-3 w-full rounded-full hover:bg-opacity-15 border-2 bg-white bg-opacity-5 p-6 text-center text-2xl"
    >
      {children}
    </button>
  );
}
