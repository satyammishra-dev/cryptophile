import React, { useEffect, useState } from "react";
import FolderInfo from "./FolderInfo";
import PasswordInfo from "./PasswordInfo";
import useNavigationStore from "@/store/navigation";
import useSelectionStore from "@/store/selection";
import useExplorerStore from "@/store/explorer";
import useUserStore from "@/store/user";
import { Folder, PasswordItem } from "@/store/user/types";
import { Button } from "@/components/ui/button";

const InfoPanel = ({}: {}) => {
  const { idPath: currentDirectoryIdPath } = useNavigationStore(
    (state) => state.currentNavigationPiece
  );
  const selectedItemIds = useSelectionStore((state) => state.selectedItemIds);
  const passwordEditorMode = useExplorerStore(
    (state) => state.passwordEditorMode
  );
  const { getOrUpdateItem } = useUserStore();

  const [infoItemPath, setInfoItemPath] = useState<string[]>(
    currentDirectoryIdPath
  );
  const [infoItem, setInfoItem] = useState<Folder | PasswordItem | undefined>();
  getOrUpdateItem(infoItemPath);

  useEffect(() => {
    if (selectedItemIds.size !== 1) {
      setInfoItemPath(currentDirectoryIdPath);
      setInfoItem(getOrUpdateItem(currentDirectoryIdPath));
      return;
    }
    setInfoItemPath([
      ...currentDirectoryIdPath,
      Array.from(selectedItemIds)[0],
    ]);
    setInfoItem(
      getOrUpdateItem([
        ...currentDirectoryIdPath,
        Array.from(selectedItemIds)[0],
      ])
    );
  }, [selectedItemIds, currentDirectoryIdPath]);

  return (
    <div
      className={`min-w-[300px] w-[100%] ${
        passwordEditorMode ? "" : "max-w-[400px] px-4 py-4"
      } border-l border-l-border h-full relative`}
    >
      <Button
        variant={"outline"}
        className="absolute top-4 left-4 h-10 w-10 rounded-full"
        onClick={() => {}}
      >
        <i className="fa-regular fa-chevron-right"></i>
      </Button>
      {
        infoItemPath &&
          infoItem &&
          ("contents" in infoItem ? (
            <FolderInfo folder={infoItem} />
          ) : (
            // null
            <PasswordInfo passwordItem={infoItem} />
          ))
        // null
      }
    </div>
  );
};

export default InfoPanel;
