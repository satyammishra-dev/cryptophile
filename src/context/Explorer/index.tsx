import Color from "@/pages/Main/Sidebar/colors";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import useUserContext, { Folder, PasswordItem } from "./../User";
import useNavigation, { Navigation } from "./Navigation";
import useSingularOperations, {
  SingularOperations,
} from "./SingularOperations";
import useBatchOperations, { BatchOperations } from "./BatchOperations";
import useExplorerConfig, { ExplorerConfig } from "./ExplorerConfig";
import useSelection, { Selection } from "./Selection";
import { getItemByPath } from "@/lib/explorer-utils";
import useStateCallback from "@/hooks/useStateCallback";

export type Path = Array<string>;

type ExplorerContext = {
  config: ExplorerConfig;
  navigation: Navigation;
  selection: Selection;
  singularOps: SingularOperations;
  batchOps: BatchOperations;
  root: Folder | undefined;
};

const Explorer = createContext<ExplorerContext | null>(null);
export type UpdateOrGetByPathType = (
  path: string[],
  newValue?: Folder | PasswordItem
) => Folder | PasswordItem | undefined;

export const ExplorerProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  //Initialization

  const DEFAULT_PATH: Path = ["home"];

  const [user, setUser, setUserProperty] = useUserContext();
  const userData = user?.userData;

  const [homeDirectory, setHomeDirectory] = useState(userData?.directory);
  const [favourites, setFavourites] = useState(userData?.favourites);
  const [tagged, setTagged] = useState(userData?.tagged);

  const currentDirIdPathState = useStateCallback(DEFAULT_PATH);
  const [currentDirectoryIdPath, setCurrentDirectoryIdPath] =
    currentDirIdPathState;

  const updateOrGetByPath: UpdateOrGetByPathType = (path, newValue) => {
    if (path === undefined) {
      path = currentDirectoryIdPath;
    }
    const updateRecursive = (
      items: Array<Folder | PasswordItem>,
      currentPath: string[]
    ): Array<Folder | PasswordItem> => {
      if (currentPath.length === 0) {
        return items.map((item) => item);
      }

      const currentId = currentPath[0];
      const remainingPath = currentPath.slice(1);

      return items.map((item) => {
        if (item.id === currentId) {
          if (remainingPath.length === 0) {
            return newValue as Folder | PasswordItem;
          }

          if ("contents" in item) {
            return {
              ...item,
              contents: updateRecursive(item.contents, remainingPath),
            };
          }
        }

        return item;
      });
    };

    if (newValue !== undefined) {
      setHomeDirectory((prevHomeDirectory) => {
        if (!prevHomeDirectory)
          throw new Error("Home directory could not be found.");
        const newHomeDirectory = {
          ...prevHomeDirectory,
          contents: (updateRecursive([prevHomeDirectory], path)[0] as Folder)
            .contents,
        };
        return newHomeDirectory;
      });
      return newValue;
    } else {
      if (!homeDirectory) throw new Error("Home directory could not be found.");

      const foundItem = getItemByPath(path, homeDirectory);
      return foundItem;
    }
  };

  const selection = useSelection(currentDirectoryIdPath, updateOrGetByPath);
  const { selectedItemIds, deselectAll, selectSingleItemById } = selection;

  const navigation = useNavigation(
    currentDirIdPathState,
    homeDirectory,
    selectSingleItemById,
    deselectAll
  );

  const config = useExplorerConfig(
    currentDirectoryIdPath,
    selectedItemIds,
    updateOrGetByPath
  );

  const singularOps = useSingularOperations(
    currentDirectoryIdPath,
    selectedItemIds,
    deselectAll,
    favourites,
    setFavourites,
    tagged,
    setTagged,
    updateOrGetByPath
  );

  const batchOps = useBatchOperations(
    currentDirectoryIdPath,
    selectedItemIds,
    deselectAll,
    favourites,
    setFavourites,
    tagged,
    setTagged,
    updateOrGetByPath
  );

  useEffect(() => {
    //For when user changes account or logs out.
    setHomeDirectory(() => {
      return userData?.directory;
    });
    setFavourites(userData?.favourites);
    setTagged(userData?.tagged);
  }, [userData]);

  useEffect(() => {
    if (!homeDirectory || !favourites || !tagged) {
      return;
    }
    setUserProperty("userData", {
      directory: homeDirectory,
      favourites,
      tagged,
    });
  }, [homeDirectory, favourites, tagged]);

  const explorer: ExplorerContext = {
    navigation,
    config,
    selection,
    singularOps,
    batchOps,
    root: homeDirectory,
  };

  return <Explorer.Provider value={explorer}>{children}</Explorer.Provider>;
};

const useExplorer = () => {
  const ctx = useContext(Explorer);
  if (!ctx) {
    throw new Error("useExplorer must be used inside ExplorerProvider");
  }

  return ctx;
};

export default useExplorer;
