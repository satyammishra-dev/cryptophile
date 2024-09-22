import Color, { ColorMap } from "@/pages/Main/Sidebar/colors";
import { Path, UpdateOrGetByPathType } from ".";
import { Folder, PasswordItem, SafeUserV2Type } from "../User";
import { checkFolderByData, getIdPathString } from "@/lib/explorer-utils";

export type BatchOperations = {
  markFavouriteByMajority: () => void;
  checkFavouriteByMajority: () => boolean | undefined;
  deleteItems: () => void;
  getItemsTagByMajority: () => Color | undefined;
  setItemsTag: (color: Color | undefined) => void;
};

type Tagged = SafeUserV2Type["userData"]["tagged"];

const useBatchOperations = (
  currentDirectoryIdPath: Path,
  selectedItemIds: Set<string>,
  deselectAll: () => void,
  favourites: string[] | undefined,
  setFavourites: React.Dispatch<React.SetStateAction<string[] | undefined>>,
  tagged: Tagged | undefined,
  setTagged: React.Dispatch<React.SetStateAction<Tagged | undefined>>,
  updateOrGetByPath: UpdateOrGetByPathType
) => {
  const checkFavouriteByMajority = () => {
    const currentDir = updateOrGetByPath(currentDirectoryIdPath);
    if (!currentDir || "password" in currentDir)
      throw new Error("The items do not exist.");
    const contents = currentDir.contents;

    let totalFreq = 0,
      favouriteFreq = 0;
    for (let i = 0; i < contents.length; i++) {
      if (!selectedItemIds.has(contents[i].id)) continue;
      totalFreq += 1;
      if (contents[i].isFavourite) favouriteFreq += 1;
    }
    const notFavouriteFreq = totalFreq - favouriteFreq;

    return notFavouriteFreq >= favouriteFreq ? false : true;
  };

  const markFavouriteByMajority = () => {
    if (!favourites) throw new Error("Unable to access favourites.");
    const isMajorityFavourite = checkFavouriteByMajority();
    const currentDir = updateOrGetByPath(currentDirectoryIdPath);
    if (!currentDir || "password" in currentDir)
      throw new Error("The items do not exist.");
    const contents = currentDir.contents;

    const newContents = contents.map((item) => {
      if (selectedItemIds.has(item.id)) {
        return { ...item, isFavourite: !isMajorityFavourite };
      }
      return item;
    });

    //Convert to set for better searching.
    const favouritesSet = new Set(favourites);
    selectedItemIds.forEach((itemId) => {
      const itemIdPathString = getIdPathString([
        ...currentDirectoryIdPath,
        itemId,
      ]);
      if (favouritesSet.has(itemIdPathString)) {
        if (isMajorityFavourite) {
          favouritesSet.delete(itemIdPathString);
        }
      } else {
        if (!isMajorityFavourite) {
          favouritesSet.add(itemIdPathString);
        }
      }
    });

    //Convert back to string[] while maintaining the order.
    const newFavourites: string[] = [];
    favourites.forEach((itemIdPathString) => {
      if (favouritesSet.has(itemIdPathString)) {
        newFavourites.push(itemIdPathString);
        favouritesSet.delete(itemIdPathString);
      }
    });
    favouritesSet.forEach((itemIdPathString) => {
      newFavourites.push(itemIdPathString);
    });

    setFavourites(() => {
      return newFavourites;
    });
    updateOrGetByPath(currentDirectoryIdPath, {
      ...currentDir,
      contents: newContents,
    });
  };

  const deleteItems = () => {
    const parentDir = updateOrGetByPath(currentDirectoryIdPath);
    if (!parentDir || "password" in parentDir)
      throw new Error("The items do not exist.");
    const contents = parentDir.contents;

    const newContents = [];

    for (let i = 0; i < contents.length; i++) {
      if (selectedItemIds.has(contents[i].id)) continue;
      const item = contents[i];
      newContents.push(item);
    }

    updateOrGetByPath(currentDirectoryIdPath, {
      ...parentDir,
      contents: newContents,
    });

    deselectAll();
  };

  const getItemsTagByMajority = () => {
    const currentDir = updateOrGetByPath(currentDirectoryIdPath);
    if (!currentDir || "password" in currentDir)
      throw new Error("The items do not exist.");
    const contents = currentDir.contents;

    type Stats = {
      undef: number;
    } & {
      [K in Color]: number;
    };
    let stats: Stats = {
      undef: 0,
      ...Object.keys(ColorMap).reduce<Omit<Stats, "undef">>((acc, color) => {
        acc[color as Color] = 0;
        return acc;
      }, {} as Omit<Stats, "undef">),
    };

    for (let i = 0; i < contents.length; i++) {
      if (!selectedItemIds.has(contents[i].id)) continue;
      const item = contents[i];
      if (item.tag === undefined) {
        stats.undef += 1;
      } else {
        stats[item.tag] += 1;
      }
    }

    let maxTag: keyof Stats = "undef";
    let maxFreq = 0;

    Object.keys(stats).forEach((key) => {
      type StatKey = keyof Stats;
      const freq = stats[key as StatKey];
      if (freq > maxFreq) {
        maxFreq = freq;
        maxTag = key as StatKey;
      }
    });

    return maxTag === "undef" ? undefined : (maxTag as Color);
  };

  const setItemsTag = (tag: Color | undefined) => {
    if (!tagged) throw new Error("Unable to access tags.");
    const currentDir = updateOrGetByPath(currentDirectoryIdPath);
    if (!currentDir || "password" in currentDir)
      throw new Error("The items do not exist.");
    const contents = currentDir.contents;

    const newTagged = { ...tagged };
    console.log("hi", newTagged);

    const newContents = contents.map((item) => {
      if (!selectedItemIds.has(item.id)) return item;

      Object.keys(newTagged).forEach((key) => {
        console.log(key, newTagged);
        newTagged[key as Color].delete(item.id);
      });

      if (tag) {
        newTagged[tag].add(item.id);
      }

      return {
        ...item,
        tag,
      };
    });

    setTagged(() => {
      return newTagged;
    });
    updateOrGetByPath(currentDirectoryIdPath, {
      ...currentDir,
      contents: newContents,
    });
  };

  const folderOps: BatchOperations = {
    markFavouriteByMajority,
    checkFavouriteByMajority,
    deleteItems,
    getItemsTagByMajority,
    setItemsTag,
  };

  return folderOps;
};

export default useBatchOperations;
