import { type Folder as FolderType } from "@/context/User";
import React from "react";

type FolderProps = {
  folder: FolderType;
};

const Folder = ({ folder }: FolderProps) => {
  return (
    <button className="flex flex-col items-center rounded-lg p-3 gap-2 hover:bg-secondary focus:border w-32">
      <i className="fa-solid fa-folder text-6xl"></i>
      <span>{folder.title}</span>
    </button>
  );
};

export default Folder;
