import { ReactNode } from "react";

export const Label = ({
  children,
  text,
}: {
  children: ReactNode;
  text: string;
}) => {
  return (
    <label>
      <span className="font-bold mb-2 block">{text}</span>
      {children}
    </label>
  );
};
