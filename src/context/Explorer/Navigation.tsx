import { useEffect, useState } from "react";
import { Path } from ".";
import { Folder } from "../User";
import { checkFolderByPath } from "@/lib/explorer-utils";
import useStateCallback, {
  SetStateCallbackGeneric,
} from "@/hooks/useStateCallback";

export type NavigationProps = {
  path: Path;
  sourceId: string | undefined;
};

export type Navigation = {
  currentDirectoryIdPath: Path;
  stack: Array<NavigationProps>;
  forwardStack: Array<NavigationProps>;
  push: (
    navigationProps: NavigationProps,
    clearStack?: boolean,
    selectionItemId?: string
  ) => void;
  pop: (selectSource?: boolean) => void;
  unpop: () => void;
};

const useNavigation = (
  currentDirIdPathState: [Path, SetStateCallbackGeneric<Path>],
  homeDirectory: Folder | undefined,
  selectSingleItemById: (id: string) => void,
  deselectAll: () => void
) => {
  const [currentDirectoryIdPath, setCurrentDirectoryIdPath] =
    currentDirIdPathState;
  const [navigationStack, setNavigationStack] = useState<NavigationProps[]>([
    { path: currentDirectoryIdPath, sourceId: undefined },
  ]);
  const [forwardNavigationStack, setForwardNavigationStack] = useState<
    NavigationProps[]
  >([]);

  const [itemToSelect, setItemToSelect] = useState<string>();
  const trySelection = (selectionItemId: string | undefined) => {
    if (selectionItemId) {
      try {
        selectSingleItemById(selectionItemId);
      } catch (err) {
        console.log("Selection attempt could not be completed.");
      }
    }
  };

  useEffect(() => {
    trySelection(itemToSelect);
  }, [itemToSelect]);

  const checkIfLocationExists = (idPath: Path) => {
    if (!homeDirectory) return false;
    return checkFolderByPath(idPath, homeDirectory);
  };

  const push = (
    { path: idPath, sourceId }: NavigationProps,
    clearStack?: boolean,
    selectionItemId?: string
  ) => {
    if (!checkIfLocationExists(idPath)) {
      throw new Error("The location does not exist.");
    }
    setNavigationStack([
      ...(clearStack ? [] : navigationStack),
      { path: idPath, sourceId },
    ]);
    setForwardNavigationStack([]);
    setCurrentDirectoryIdPath(
      () => {
        return idPath;
      },
      () => {
        if (!selectionItemId) {
          deselectAll();
          return;
        }
        setItemToSelect(selectionItemId);
      }
    );
  };

  const pop = (selectSource?: boolean) => {
    if (navigationStack.length === 1) return;
    const navigationStackTemp = [...navigationStack];
    const [popped] = navigationStackTemp.splice(-1, 1);
    while (
      navigationStackTemp.length > 1 &&
      !checkIfLocationExists(
        navigationStackTemp[navigationStackTemp.length - 1].path
      )
    ) {
      navigationStackTemp.pop();
    }
    if (navigationStackTemp.length === 0) {
      navigationStackTemp.push({ path: ["home"], sourceId: undefined });
    }
    setNavigationStack([...navigationStackTemp]);
    setForwardNavigationStack([...forwardNavigationStack, popped]);
    setCurrentDirectoryIdPath(
      () => navigationStackTemp[navigationStackTemp.length - 1].path,
      () => {
        if (selectSource === false) {
          deselectAll();
        } else {
          setItemToSelect(popped.sourceId);
        }
      }
    );
  };

  const unpop = () => {
    if (forwardNavigationStack.length === 0) return;
    const forwardNavigationStackTemp = [...forwardNavigationStack];
    while (
      forwardNavigationStackTemp.length > 0 &&
      !checkIfLocationExists(
        forwardNavigationStackTemp[forwardNavigationStackTemp.length - 1].path
      )
    ) {
      forwardNavigationStackTemp.pop();
    }
    // console.log("unp", forwardNavigationStack)
    if (forwardNavigationStackTemp.length === 0) {
      setForwardNavigationStack([]);
      return;
    }
    const [popped] = forwardNavigationStackTemp.splice(-1, 1);
    setForwardNavigationStack(forwardNavigationStackTemp);
    setNavigationStack([...navigationStack, popped]);
    setCurrentDirectoryIdPath(() => popped.path);
    deselectAll();
  };

  const navigation: Navigation = {
    currentDirectoryIdPath,
    stack: navigationStack,
    forwardStack: forwardNavigationStack,
    push,
    pop,
    unpop,
  };

  return navigation;
};

export default useNavigation;
