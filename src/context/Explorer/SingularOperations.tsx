import Color from "@/pages/Main/Sidebar/colors";
import { Path, UpdateOrGetByPathType } from ".";
import { Folder, PasswordItem, SafeUserV1Type } from "../User";
import { checkFolderByData, getIdPathString } from "@/lib/explorer-utils";

export type SingularOperations = {
  createFolder: (name: string, path?: Path) => void;
  createPassword: (
    name: string,
    path?: Path,
    username?: string,
    password?: string
  ) => void;
  setFavourite: (path?: Path, value?: boolean) => void;
  checkFavourite: (path?: Path) => boolean | undefined;
  renameItem: (name: string, path?: Path) => void;
  deleteItem: (path?: Path) => void;
  getItemTag: (path?: Path) => Color | undefined;
  setItemTag: (color: Color | undefined, path?: Path) => void;
};

type Tagged = SafeUserV1Type["userData"]["tagged"];

const useSingularOperations = (
  currentDirectoryIdPath: Path,
  selectedItemIds: Set<string>,
  favourites: string[] | undefined,
  setFavourites: React.Dispatch<React.SetStateAction<string[] | undefined>>,
  tagged: Tagged | undefined,
  setTagged: React.Dispatch<React.SetStateAction<Tagged | undefined>>,
  updateOrGetByPath: UpdateOrGetByPathType
) => {
  const NEW_FOLDER_DATA = (name: string): Folder => {
    return {
      title: name,
      description: "",
      id: "new-folder",
      created: new Date(),
      lastModified: new Date(),
      contents: [],
      isFavourite: false,
    };
  };

  const NEW_PASSWORD_ITEM_DATA = (
    name: string,
    username?: string,
    password?: string
  ): PasswordItem => {
    return {
      title: name,
      description: "",
      id: "new-password",
      username: username ? username : "",
      password: password ? password : "",
      created: new Date(),
      lastModified: new Date(),
      isFavourite: false,
    };
  };

  const getPathIntelligently = (path?: Path): Path => {
    if (path !== undefined) return path;
    if (selectedItemIds.size === 0) return currentDirectoryIdPath;
    if (selectedItemIds.size === 1)
      return [...currentDirectoryIdPath, ...Array.from(selectedItemIds)];
    return currentDirectoryIdPath;
  };

  const createFolder = (name: string, path?: Path) => {
    path = path ? path : currentDirectoryIdPath;
    const dir = updateOrGetByPath(path);
    if (!dir || !("contents" in dir))
      throw new Error("The location does not exist.");
    const contents = dir.contents;
    const newContents = [...contents, NEW_FOLDER_DATA(name)];
    updateOrGetByPath(path ? path : currentDirectoryIdPath, {
      ...dir,
      contents: newContents,
    });
  };

  const createPassword = (
    name: string,
    path?: Path,
    username?: string,
    password?: string
  ) => {
    updateOrGetByPath(
      path ? path : currentDirectoryIdPath,
      NEW_PASSWORD_ITEM_DATA(name, username, password)
    );
  };

  const checkFavourite = (path?: Path) => {
    const item = updateOrGetByPath(getPathIntelligently(path));
    if (!item) throw new Error("The item does not exist.");

    return item.isFavourite;
  };

  const setFavourite = (path?: Path, value?: boolean) => {
    if (!favourites) throw new Error("Unable to access favourites.");
    const resolvedPath = getPathIntelligently(path);
    const item = updateOrGetByPath(resolvedPath);
    if (!item) throw new Error("The item does not exist.");

    if (value === undefined) {
      value = !item.isFavourite;
    }

    if (item.isFavourite === value) return;

    const favouritesTemp = [...favourites];
    const idPathString = getIdPathString(resolvedPath);
    if (value) {
      setFavourites([...favouritesTemp, idPathString]);
    } else {
      const indexOfItem = favourites.indexOf(idPathString);
      favouritesTemp.splice(indexOfItem, 1);
      if (indexOfItem === -1) {
        throw new Error("The item is not a favourite already.");
      }
      setFavourites([...favouritesTemp]);
    }
    updateOrGetByPath(resolvedPath, { ...item, isFavourite: value });
  };

  const renameItem = (name: string, path?: Path) => {
    const resolvedPath = getPathIntelligently(path);
    if (resolvedPath.length === 1) throw new Error("Home cannot be renamed.");
    const item = updateOrGetByPath(resolvedPath);
    if (!item) throw new Error("The item does not exist.");
    updateOrGetByPath(resolvedPath, {
      ...item,
      title: name,
      lastModified: new Date(),
    });
  };

  const deleteItem = (path?: Path) => {
    const resolvedPath = getPathIntelligently(path);
    if (resolvedPath.length === 1) throw new Error("Home cannot be deleted.");

    const itemId = resolvedPath[resolvedPath.length - 1];
    const itemParentPath = resolvedPath.splice(-1, 1);
    const itemParent = updateOrGetByPath(itemParentPath);
    if (!itemParent || !checkFolderByData(itemParent))
      throw new Error("The item could not be located.");

    const contents = [...itemParent.contents];
    let itemExists = false;
    for (let i = 0; i < contents.length; i++) {
      if (contents[i].id !== itemId) {
        itemExists = true;
        continue;
      }
      contents.splice(i, 1);
      break;
    }

    if (itemExists) {
      updateOrGetByPath(itemParentPath, { ...itemParent, contents });
      return;
    }
    throw new Error("The item does not exist.");
  };

  const getItemTag = (path?: Path) => {
    const item = updateOrGetByPath(getPathIntelligently(path));
    if (!item) throw new Error("The item does not exist.");

    return item.tag;
  };

  const setItemTag = (tag: Color | undefined, path?: Path) => {
    if (!tagged) throw new Error("Unable to access tags.");
    const resolvedPath = getPathIntelligently(path);

    const item = updateOrGetByPath(resolvedPath);
    if (!item) throw new Error("The item does not exist.");

    item.tag = tag;
    const idPath = getIdPathString(resolvedPath);
    const newTagged = { ...tagged };
    Object.keys(newTagged).forEach((key) => {
      const items = tagged[key as Color];
      items.delete(idPath);
    });
    if (tag) {
      newTagged[tag].add(idPath);
    }
    setTagged(newTagged);
  };

  const folderOps: SingularOperations = {
    createFolder,
    createPassword,
    setFavourite,
    checkFavourite,
    renameItem,
    deleteItem,
    getItemTag,
    setItemTag,
  };

  return folderOps;
};

export default useSingularOperations;
