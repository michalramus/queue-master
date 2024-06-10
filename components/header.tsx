import { ReactNode } from "react";

export default function Header({ children }: { children: ReactNode }) {
  return (
    <div className="w-full rounded-full font-semibold border-2 bg-white bg-opacity-10 p-6 text-center">
      <h1 className="text-5xl">{children}</h1>
    </div>
  );
}
