import { Button } from "@/components/ui/button";
import useExplorer from "@/context/Explorer";
import { getItemByPath } from "@/lib/explorer-utils";
import React, { useEffect, useState } from "react";
import Folder from "./Folder";
import EmptyFolder from "./EmptyFolderPage";
import PasswordItem from "./PasswordItem";

const Body = () => {
  const {
    navigation: { currentDirectoryIdPath, push },
    selection: {
      selectedItemIds,
      selectItemById,
      selectSingleItemById,
      deselectItemById,
      selectionMode,
    },
    config: {
      expandedPasswordViewState: [, setExpandedPasswordView],
    },
    root: homeDirectory,
  } = useExplorer();

  const directory = homeDirectory
    ? getItemByPath(currentDirectoryIdPath, homeDirectory)
    : undefined;

  const handleItemClick = (id: string) => {
    if (selectionMode) {
      if (selectedItemIds.has(id)) {
        deselectItemById(id);
      } else {
        selectItemById(id);
      }
    } else {
      selectItemById(id);
    }
  };

  const handlePasswordDoubleClick = (id: string) => {
    if (selectionMode) return;
    selectSingleItemById(id);
    setExpandedPasswordView(true);
  };

  const navigateToFolderContents = (id: string) => {
    if (!selectionMode)
      push({ path: [...currentDirectoryIdPath, id], sourceId: id });
  };

  //Select newly created item:
  useEffect(() => {
    if (
      directory &&
      "contents" in directory &&
      directory.contents.length === 1
    ) {
      selectSingleItemById(directory.contents[0].id);
    }
  }, [directory]);

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
