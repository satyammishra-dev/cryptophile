import useExplorer from "@/context/Explorer";
import { type Folder as FolderType } from "@/context/User";
import React from "react";

type FolderProps = {
  folder: FolderType;
};

const Folder = ({ folder }: FolderProps) => {
  const { navigation } = useExplorer();

  const navigateToFolderContents = () => {
    navigation.push([...navigation.currentDirectoryIdPath, folder.id]);
  };

  return (
    <button
      className="flex flex-col items-center rounded-lg p-3 gap-2 hover:bg-secondary focus:border w-32"
      onClick={(evt) => {
        // console.log("yo1");
        // handleDoubleClick(evt);
      }}
      onDoubleClick={() => {
        navigateToFolderContents();
      }}
    >
      <i className="fa-solid fa-folder text-6xl"></i>
      <span>{folder.title}</span>
    </button>
  );
};

export default Folder;
