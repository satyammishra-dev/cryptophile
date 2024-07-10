import React, { HTMLAttributes, InputHTMLAttributes } from "react";

type CompoundInputProps = {
  children: React.ReactNode;
  parentClassName?: string;
} & InputHTMLAttributes<HTMLInputElement>;

const CompoundInput = ({
  children,
  parentClassName,
  ...props
}: CompoundInputProps) => {
  return (
    <div
      className={`flex items-center overflow-hidden w-full rounded-md border border-input bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
        parentClassName ? parentClassName : ""
      }`}
    >
      <input
        {...props}
        className={`h-10 rounded-md text-base px-2 outline-none focus:outline-none ${props.className}`}
      />
      {children}
    </div>
  );
};

export default CompoundInput;
