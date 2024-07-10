import Color from "@/pages/Main/Sidebar/colors";
import { useState } from "react";
import { Path, UpdateOrGetByPathType } from ".";
import { Folder } from "../User";
import { getItemByPath } from "@/lib/explorer-utils";

export type Selection = {
  selectionMode: boolean;
  setSelectionMode: (newSelectionMode: boolean) => void;
  selectItemById: (itemId: string) => void;
  deselectItemById: (itemId: string) => void;
  selectAll: () => void;
  deselectAll: () => void;
  selectedItemIds: Set<string>;
  checkItemSelectedById: (itemId: string) => boolean;
};

type SelectedItemIds = Set<string>;

const useSelection = (
  currentDirectoryIdPath: Path,
  updateOrGetByPath: UpdateOrGetByPathType
) => {
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedItemIds, setSelectedItemIds] = useState<SelectedItemIds>(
    new Set()
  );

  const addItem = (item: string) => {
    const newSet = new Set(selectedItemIds);
    newSet.add(item);
    setSelectedItemIds(newSet);
  };

  const removeItem = (item: string) => {
    const newSet = new Set(selectedItemIds);
    newSet.delete(item);
    setSelectedItemIds(newSet);
  };

  const selectItemById = (id: string) => {
    const currentDir = updateOrGetByPath(currentDirectoryIdPath);
    if (!currentDir || "password" in currentDir)
      throw new Error("Location could not be found.");
    const contents = currentDir.contents;

    if (!selectionMode) {
      const item = contents.find((item) => item.id === id);
      if (!item) throw new Error("The item could not be found.");
      const newSet = new Set<string>();
      newSet.add(id);
      setSelectedItemIds(newSet);
      return;
    }

    for (let i = 0; i < contents.length; i++) {
      if (contents[i].id !== id) continue;
      if (selectedItemIds.has(id))
        throw new Error("The item is already selected.");
      addItem(id);
      return;
    }
    throw new Error("The item could not be found.");
  };

  const deselectItemById = (id: string) => {
    const currentDir = updateOrGetByPath(currentDirectoryIdPath);
    if (!currentDir || "password" in currentDir)
      throw new Error("Location could not be found.");
    const contents = currentDir.contents;
    for (let i = 0; i < contents.length; i++) {
      if (contents[i].id !== id) continue;
      if (!selectedItemIds.has(id))
        throw new Error("The item is already unselected.");
      removeItem(id);
      return;
    }
    throw new Error("The item could not be found.");
  };

  const selectAll = () => {
    const currentDir = updateOrGetByPath(currentDirectoryIdPath);

    if (!currentDir || "password" in currentDir)
      throw new Error("Location could not be found.");
    const contents = currentDir.contents;

    setSelectionMode(true);
    const newSet = new Set<string>();
    contents.forEach((item) => {
      newSet.add(item.id);
    });

    setSelectedItemIds(newSet);
  };

  const deselectAll = () => {
    setSelectedItemIds(new Set<string>());
  };

  const checkItemSelectedById = (id: string) => {
    return selectedItemIds.has(id);
  };

  const selection: Selection = {
    selectionMode,
    setSelectionMode,
    selectItemById,
    deselectItemById,
    selectAll,
    deselectAll,
    selectedItemIds,
    checkItemSelectedById,
  };

  return selection;
};

export default useSelection;
