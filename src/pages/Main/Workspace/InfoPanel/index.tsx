import React, { useEffect, useState } from "react";
import FolderInfo from "./FolderInfo";
import PasswordInfo from "./PasswordInfo";
import useExplorer from "@/context/Explorer";
import { getItemByPath } from "@/lib/explorer-utils";
import { Folder, PasswordItem } from "@/context/User";

const InfoPanel = ({}: {}) => {
  const {
    navigation: { currentDirectoryIdPath },
    selection: { selectedItemIds, selectionMode },
    config: {
      expandedPasswordViewState: [expandedPasswordView],
    },
    root,
  } = useExplorer();

  const [infoItemPath, setInfoItemPath] = useState<string[]>();

  useEffect(() => {
    if (selectionMode || selectedItemIds.size !== 1) {
      setInfoItemPath(currentDirectoryIdPath);
      return;
    }
    setInfoItemPath([
      ...currentDirectoryIdPath,
      Array.from(selectedItemIds)[0],
    ]);
  }, [selectedItemIds, currentDirectoryIdPath]);

  const [infoItem, setInfoItem] = useState<Folder | PasswordItem>();
  useEffect(() => {
    if (!infoItemPath || !root) {
      setInfoItem(undefined);
      return;
    }
    setInfoItem(getItemByPath(infoItemPath, root));
  }, [infoItemPath]);

  return (
    <div
      className={`min-w-[300px] w-[100%] ${
        expandedPasswordView ? "" : "max-w-[400px] px-4 py-4"
      } border-l border-l-border h-full`}
    >
      {infoItemPath &&
        infoItem &&
        ("contents" in infoItem ? (
          <FolderInfo idPath={infoItemPath} folder={infoItem} />
        ) : (
          <PasswordInfo idPath={infoItemPath} passwordItem={infoItem} />
        ))}
    </div>
  );
};

export default InfoPanel;
