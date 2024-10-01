import React, { useEffect, useState } from "react";
import Folder from "./Folder";
import EmptyFolder from "./EmptyFolderPage";
import PasswordItem from "./PasswordItem";
import useNavigationStore from "@/store/navigation";
import useSelectionStore from "@/store/selection";
import useExplorerStore from "@/store/explorer";
import useUserStore from "@/store/user";

const Body = () => {
  const { getOrUpdateItem } = useUserStore();
  const {
    selectedItemIds,
    selectItems,
    reselectItems,
    deselectItems,
    selectionMode,
  } = useSelectionStore();
  const setPasswordEditorMode = useExplorerStore(
    (state) => state.setPasswordEditorMode
  );
  const { idPath: currentDirectoryIdPath } = useNavigationStore(
    (state) => state.currentNavigationPiece
  );
  const push = useNavigationStore((state) => state.push);

  const directory = getOrUpdateItem(currentDirectoryIdPath);

  const handleItemClick = (id: string) => {
    if (selectionMode) {
      if (selectedItemIds.has(id)) {
        deselectItems([id]);
      } else {
        selectItems([id]);
      }
    } else {
      reselectItems([id]);
    }
  };

  const handlePasswordDoubleClick = (id: string) => {
    if (selectionMode) return;
    reselectItems([id]);
    setPasswordEditorMode(true);
  };

  const navigateToFolderContents = (id: string) => {
    if (!selectionMode) push([...currentDirectoryIdPath, id]);
  };

  return (
    <>
      {directory &&
        ("contents" in directory ? (
          directory.contents.length === 0 ? (
            <EmptyFolder />
          ) : (
            <div className="flex flex-col flex-1 items-start justify-start">
              <div className="flex flex-wrap gap-1 p-4 select-none">
                {directory.contents.map((item) => {
                  return "contents" in item ? (
                    <Folder
                      folder={item}
                      key={item.id}
                      isSelected={selectedItemIds.has(item.id)}
                      showSelectCheckbox={selectionMode}
                      onClick={() => handleItemClick(item.id)}
                      onDoubleClick={() => navigateToFolderContents(item.id)}
                    />
                  ) : (
                    <PasswordItem
                      passwordItem={item}
                      key={item.id}
                      isSelected={selectedItemIds.has(item.id)}
                      showSelectCheckbox={selectionMode}
                      onClick={() => handleItemClick(item.id)}
                      onDoubleClick={() => handlePasswordDoubleClick(item.id)}
                    />
                  );
                })}
              </div>
            </div>
          )
        ) : (
          <div>Invalid Location</div>
        ))}
    </>
  );
};

export default Body;
