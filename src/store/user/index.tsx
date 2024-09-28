import { create } from "zustand";
import { Folder, PasswordItem, User, UserData } from "./types";
import { produce } from "immer";

type State = {
  userInfo: Omit<User, "userData"> | null;
  userDirectory: Folder | null;
  userFavourites: UserData["favourites"] | null;
  userTagged: UserData["tagged"] | null;
};

type Action = {
  setUserInfo: (value: Omit<User, "userData"> | null) => void;
  setUserDirectory: (value: Folder | null) => void;
  setUserFavourites: (value: UserData["favourites"] | null) => void;
  setUserTagged: (value: UserData["tagged"] | null) => void;
  getOrUpdateItem: (
    idPath: string[],
    value?: Folder | PasswordItem
  ) => Folder | PasswordItem | undefined;
};

// Helper function to traverse the folder structure
const getItemByPath = (
  path: string[],
  homeDirectory: Folder
): Folder | PasswordItem | undefined => {
  if (path.length === 0) return homeDirectory; // Root folder

  let currentContents: (Folder | PasswordItem)[] = [homeDirectory];

  for (let i = 0; i < path.length; i++) {
    const currentItem = currentContents.find((item) => item.id === path[i]);
    if (!currentItem) return; // Path not found
    if (i === path.length - 1) return currentItem; // Return the item at the last path segment
    if (!("contents" in currentItem)) return; // Not a folder, can't traverse further
    currentContents = [...currentItem.contents]; // Move deeper into the folder structure
  }
};

export const checkIsFolder = (
  value: Folder | PasswordItem | undefined
): value is Folder => {
  if (!value) return false;
  if (!("contents" in value)) return false;
  return true;
};

const useUserStore = create<State & Action>((set) => {
  return {
    userInfo: null,
    userDirectory: null,
    userFavourites: null,
    userTagged: null,
    setUserInfo: (value: Omit<User, "userData"> | null) =>
      set({ userInfo: value }),
    setUserDirectory: (value: Folder | null) => set({ userDirectory: value }),
    setUserFavourites: (value: UserData["favourites"] | null) =>
      set({ userFavourites: value }),
    setUserTagged: (value: UserData["tagged"] | null) =>
      set({ userTagged: value }),
    getOrUpdateItem: (
      idPath: string[],
      value?: Folder | PasswordItem
    ): Folder | PasswordItem | undefined => {
      let homeDirectory: Folder | undefined = undefined;
      set((state) => {
        homeDirectory = state.userDirectory ?? undefined;
        return {};
      });

      if (!homeDirectory)
        throw new Error("This option is not currently available.");

      if (!value) {
        const currentItem = getItemByPath(idPath, homeDirectory);
        if (!currentItem) return undefined;
        return currentItem;
      }

      set(
        produce((state: State & Action) => {
          const targetItemId = idPath[idPath.length - 1];
          homeDirectory = state.userDirectory ?? undefined;
          let dir: Folder | undefined = homeDirectory;

          for (let i = 0; i < idPath.length - 1; i++) {
            if (!dir) return;
            const itemIndex = dir.contents.findIndex(
              (item) => item.id === idPath[i] && "contents" in item
            );
            if (itemIndex === -1) return;
            dir = dir.contents[itemIndex] as Folder;
          }

          if (!dir) return;
          const itemIndex = dir.contents.findIndex(
            (item) => item.id === targetItemId
          );
          if (itemIndex === -1) {
            dir.contents.push(value as Folder | PasswordItem);
          } else {
            dir.contents[itemIndex] = value as Folder | PasswordItem;
          }
        })
      );
    },
  } as State & Action;
});

export default useUserStore;
