import { ColorMap, type Folder as FolderType } from "@/store/user/types";
import React from "react";

type FolderProps = {
  folder: FolderType;
  isSelected?: boolean;
  showSelectCheckbox?: boolean;
} & React.HTMLAttributes<HTMLButtonElement>;

const Folder = ({
  folder,
  isSelected,
  showSelectCheckbox,
  ...props
}: FolderProps) => {
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
    >
      {folder.isFavourite && (
        <i className="fa-solid fa-circle-star absolute top-2 right-4 text-primary text-sm"></i>
      )}
      {/*
      folder.tag && (
        <div
          className="h-2 w-2 rounded-full absolute top-6 right-"
          style={{ background: `rgb(${ColorMap[folder.tag]})` }}
        ></div>
      )
      */}
      {showSelectCheckbox &&
        (isSelected ? (
          <i className="fa-solid fa-check-square absolute top-2 left-2"></i>
        ) : (
          <i className="fa-regular fa-square absolute top-2 left-2"></i>
        ))}
      <i
        className="fa-solid fa-folder text-primary text-6xl"
        style={{ color: folder.tag ? `rgb(${ColorMap[folder.tag]})` : "" }}
      ></i>
      <span>{folder.title}</span>
    </button>
  );
};

export default Folder;
