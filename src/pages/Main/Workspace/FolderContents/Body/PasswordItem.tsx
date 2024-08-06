import useExplorer from "@/context/Explorer";
import { type PasswordItem as PasswordItemType } from "@/context/User";
import React from "react";

type PasswordItemProps = {
  passwordItem: PasswordItemType;
  isSelected?: boolean;
  showSelectCheckbox?: boolean;
} & React.HTMLAttributes<HTMLButtonElement>;

const PasswordItem = ({
  passwordItem,
  isSelected,
  showSelectCheckbox,
  ...props
}: PasswordItemProps) => {
  return (
    <button
      {...props}
      className={`relative flex flex-col items-center rounded-lg p-3 gap-2 border ${
        isSelected
          ? "bg-secondary hover:bg-secondary border-border"
          : "hover:bg-secondary/80 border-transparent"
      } w-32 ${props.className}`}
      onClick={(evt) => {
        props?.onClick?.(evt);
      }}
      onDoubleClick={(evt) => {
        props?.onDoubleClick?.(evt);
      }}
    >
      {showSelectCheckbox &&
        (isSelected ? (
          <i className="fa-solid fa-check-square absolute top-2 left-2"></i>
        ) : (
          <i className="fa-regular fa-square absolute top-2 left-2"></i>
        ))}
      <i className="fa-solid fa-key text-6xl"></i>
      <span>{passwordItem.title}</span>
    </button>
  );
};

export default PasswordItem;
