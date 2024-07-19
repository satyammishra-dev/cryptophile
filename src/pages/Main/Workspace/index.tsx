import useUserContext, { Folder, PasswordItem } from "@/context/User";
import React, { useEffect, useRef, useState } from "react";
import PasswordItemView from "./PasswordItemView";
import FolderContents from "./FolderContents";
import InfoPanel from "./InfoPanel";
import { checkFolderByPath } from "@/lib/explorer-utils";
import useExplorer from "@/context/Explorer";
import autoAnimate from "@formkit/auto-animate";

const Workspace = () => {
  const [user] = useUserContext();
  const {
    navigation: { currentDirectoryIdPath },
    config: {
      expandedPasswordViewState: [expandedPasswordView],
    },
    root,
  } = useExplorer();

  const currentDirIdPath = currentDirectoryIdPath;
  const homeDirectory = user?.userData.directory;

  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    wrapperRef.current && autoAnimate(wrapperRef.current);
  }, [wrapperRef]);

  return (
    <div className="flex-1">
      <div className="w-full h-full flex items-start" ref={wrapperRef}>
        {!expandedPasswordView && <FolderContents />}
        <InfoPanel />
      </div>
    </div>
  );
};

export default Workspace;
