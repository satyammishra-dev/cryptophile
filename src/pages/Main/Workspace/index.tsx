import useUserContext, { Folder, PasswordItem } from "@/context/User";
import React from "react";
import PasswordItemView from "./PasswordItemView";
import FolderContents from "./FolderContents";
import InfoPanel from "./InfoPanel";
import { checkFolderByPath } from "@/lib/explorer-utils";
import useExplorer from "@/context/Explorer";

const Workspace = () => {
  const [user] = useUserContext();
  const { navigation } = useExplorer();

  const currentDirIdPath = navigation.currentDirectoryIdPath;
  const homeDirectory = user?.userData.directory;

  const isFolder =
    currentDirIdPath &&
    homeDirectory &&
    checkFolderByPath(currentDirIdPath, homeDirectory);

  return (
    <div className="flex-1">
      <div className="w-full h-full flex items-start">
        <FolderContents />
        <InfoPanel />
        {/* {user && (isFolder ? <FolderView /> : <PasswordItemView />)} */}
      </div>
    </div>
  );
};

export default Workspace;
