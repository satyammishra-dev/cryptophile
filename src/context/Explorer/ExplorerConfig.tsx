import Color from "@/pages/Main/Sidebar/colors";
import { useEffect, useState } from "react";
import { Path, UpdateOrGetByPathType } from ".";
import { Folder } from "../User";

export type ViewMode = "GRID" | "LIST";
export type Filter = Color | undefined;
export type SortMode = "A" | "Z" | "NEW" | "OLD" | undefined;

export type ExplorerConfig = {
  viewModeState: [ViewMode, React.Dispatch<React.SetStateAction<ViewMode>>];
  filterState: [Filter, React.Dispatch<React.SetStateAction<Filter>>];
  sortModeState: [SortMode, React.Dispatch<React.SetStateAction<SortMode>>];
  focussedIdPaths: Path[];
};

const useExplorerConfig = (
  currentDirectoryIdPath: Path,
  selectedIds: Set<string>,
  updateOrGetByPath: UpdateOrGetByPathType
) => {
  const viewModeState = useState<ViewMode>("GRID");
  const [viewMode, setViewMode] = viewModeState;

  const filterState = useState<Color>();
  const [filter, setFilterMode] = filterState;

  const sortModeState = useState<SortMode>();
  const [sortMode, setSortMode] = sortModeState;

  const getSelectedIdPathsFromSelectedIds = (
    selectedIds: Set<string>
  ): Path[] => {
    const selectedIdPaths: Path[] = [];
    selectedIds.forEach((id) =>
      selectedIdPaths.push([...currentDirectoryIdPath, id])
    );
    return selectedIdPaths;
  };
  const selectedIdPaths = getSelectedIdPathsFromSelectedIds(selectedIds);

  const [focussedIdPaths, setFocussedIdPaths] = useState<Path[]>(
    selectedIdPaths.length > 0 ? selectedIdPaths : [currentDirectoryIdPath]
  );
  useEffect(() => {
    const selectedIdPaths = getSelectedIdPathsFromSelectedIds(selectedIds);
    if (selectedIdPaths.length > 0) {
      setFocussedIdPaths(selectedIdPaths);
    } else {
      setFocussedIdPaths([currentDirectoryIdPath]);
    }
  }, [selectedIds]);

  const explorerConfig: ExplorerConfig = {
    viewModeState,
    filterState,
    sortModeState,
    focussedIdPaths,
  };

  return explorerConfig;
};

export default useExplorerConfig;
