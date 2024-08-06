import { useState } from "react";
import { Path } from ".";
import { Folder } from "../User";
import { checkFolderByPath } from "@/lib/explorer-utils";

export type Navigation = {
  currentDirectoryIdPath: Path;
  stack: Array<Path>;
  forwardStack: Array<Path>;
  push: (path: Path, clearStack?: boolean) => void;
  pop: () => void;
  unpop: () => void;
};

const useNavigation = (homeDirectory: Folder | undefined) => {
  const DEFAULT_PATH: Path = ["home"];
  const [currentDirectoryIdPath, setCurrentDirectoryIdPath] =
    useState(DEFAULT_PATH);
  const [navigationStack, setNavigationStack] = useState<Path[]>([
    currentDirectoryIdPath,
  ]);
  const [forwardNavigationStack, setForwardNavigationStack] = useState<Path[]>(
    []
  );

  const checkIfLocationExists = (idPath: Path) => {
    if (!homeDirectory) return false;
    return checkFolderByPath(idPath, homeDirectory);
  };

  const push = (idPath: Path, clearStack?: boolean) => {
    if (!checkIfLocationExists(idPath)) {
      throw new Error("The location does not exist.");
    }
    setNavigationStack([...(clearStack ? [] : navigationStack), idPath]);
    setForwardNavigationStack([]);
    setCurrentDirectoryIdPath(idPath);
  };
  const pop = () => {
    if (navigationStack.length === 1) return;
    const navigationStackTemp = [...navigationStack];
    const [popped] = navigationStackTemp.splice(-1, 1);
    while (
      navigationStackTemp.length > 1 &&
      !checkIfLocationExists(
        navigationStackTemp[navigationStackTemp.length - 1]
      )
    ) {
      navigationStackTemp.pop();
    }
    if (navigationStackTemp.length === 0) {
      navigationStackTemp.push(["home"]);
    }
    setNavigationStack([...navigationStackTemp]);
    setForwardNavigationStack([...forwardNavigationStack, popped]);
    setCurrentDirectoryIdPath(
      navigationStackTemp[navigationStackTemp.length - 1]
    );
  };
  const unpop = () => {
    if (forwardNavigationStack.length === 0) return;
    const forwardNavigationStackTemp = [...forwardNavigationStack];
    while (
      forwardNavigationStackTemp.length > 0 &&
      !checkIfLocationExists(
        forwardNavigationStackTemp[forwardNavigationStackTemp.length - 1]
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
    setCurrentDirectoryIdPath(popped);
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
