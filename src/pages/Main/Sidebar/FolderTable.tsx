import React from "react";

import useUserContext, { Folder, UserV2Type } from "@/context/User";
import useExplorer from "@/context/Explorer";
import useNavigationStore from "@/store/navigation";

type FolderProps = {
  folderData: Folder;
  isActive?: boolean;
} & React.HTMLAttributes<HTMLButtonElement>;

const FolderItem = ({
  folderData,
  isActive = false,
  ...props
}: FolderProps) => {
  return (
    <button
      className={`w-full ${
        isActive ? "bg-foreground/10" : "hover:bg-foreground/5"
      } inline-flex items-center gap-2 rounded-md px-2 py-1 group justify-between`}
      {...props}
    >
      <div className="flex items-center gap-2">
        <i
          className={`fa-solid fa-folder-closed ${
            isActive ? "text-foreground" : "text-foreground/60"
          } group-hover:text-foreground`}
        ></i>
        <span>{folderData.title}</span>
      </div>
      <div className="flex items-center gap-2 mr-1 pointer-events-none opacity-0 group-hover:pointer-events-auto group-hover:opacity-100 focus-within:opacity-100">
        <i className="text-sm fa-regular fa-pen text-muted-foreground hover:text-foreground "></i>
        <i className="text-sm fa-regular fa-trash text-muted-foreground hover:text-destructive "></i>
      </div>
    </button>
  );
};

type FolderTableProps = {
  // foldersData: Folder[];
};

const FolderTable = ({}: FolderTableProps) => {
  const { navigation, root: homeDirectory } = useExplorer();
  const currentDirIdPath = navigation.currentDirectoryIdPath;
  const push = useNavigationStore((state) => state.push);

  return (
    <>
      {homeDirectory?.contents.map((item) => {
        if (!("contents" in item)) return;
        return (
          <FolderItem
            folderData={item}
            isActive={
              currentDirIdPath !== undefined &&
              currentDirIdPath.length > 0 &&
              currentDirIdPath[1] === item.id
            }
            onClick={() => {
              push({ idPath: ["home", item.id] });
            }}
            key={item.id}
          />
        );
      })}
    </>
  );
};

export default FolderTable;
