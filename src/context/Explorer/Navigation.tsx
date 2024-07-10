import { useState } from "react";
import { Path } from ".";

export type Navigation = {
  currentDirectoryIdPath: Path;
  stack: Array<Path>;
  forwardStack: Array<Path>;
  push: (path: Path, clearStack?: boolean) => void;
  pop: () => void;
  unpop: () => void;
};

const useNavigation = () => {
  const DEFAULT_PATH: Path = ["home"];
  const [currentDirectoryIdPath, setCurrentDirectoryIdPath] =
    useState(DEFAULT_PATH);
  const [navigationStack, setNavigationStack] = useState<Path[]>([
    currentDirectoryIdPath,
  ]);
  const [forwardNavigationStack, setForwardNavigationStack] = useState<Path[]>(
    []
  );

  const push = (idPath: Path, clearStack?: boolean) => {
    setNavigationStack([...(clearStack ? [] : navigationStack), idPath]);
    setForwardNavigationStack([]);
    setCurrentDirectoryIdPath(idPath);
  };
  const pop = () => {
    if (navigationStack.length === 1) return;
    const navigationStackTemp = [...navigationStack];
    const [popped] = navigationStackTemp.splice(-1, 1);
    setNavigationStack(navigationStackTemp);
    setForwardNavigationStack([...forwardNavigationStack, popped]);
    setCurrentDirectoryIdPath(
      navigationStackTemp[navigationStackTemp.length - 1]
    );
  };
  const unpop = () => {
    if (forwardNavigationStack.length === 0) return;
    const forwardNavigationStackTemp = [...forwardNavigationStack];
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
