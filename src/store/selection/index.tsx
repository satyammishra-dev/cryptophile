import { create } from "zustand";
import useUserStore, { checkIsFolder } from "../user";
import useNavigationStore from "../navigation";

type State = {
  selectedItemIds: Set<string>;
};

type Action = {
  selectItems: (itemIds: string[]) => void;
  reselectItems: (itemIds: string[]) => void;
  deslectItems: (itemIds: string[]) => void;
  selectAll: () => void;
  deselectAll: () => void;
  checkItemSelected: (itemId: string) => boolean;
};

const useSelectionStore = create<State & Action>((set) => {
  return {
    selectedItemIds: new Set<string>(),
    selectItems: (itemIds: string[]) =>
      set((state) => {
        const currentDirIdPath =
          useNavigationStore.getState().currentNavigationPiece.idPath;
        const currentDir = useUserStore
          .getState()
          .getOrUpdateItem(currentDirIdPath);
        if (!checkIsFolder(currentDir)) {
          throw new Error("Directory is not available");
        }
        const itemIdsSet = new Set(itemIds);
        const selectedItemIds = new Set(state.selectedItemIds);
        currentDir.contents.forEach((item) => {
          if (itemIdsSet.has(item.id)) {
            selectedItemIds.add(item.id);
          }
        });
        const size = selectedItemIds.size;
        return { selectedItemIds };
      }),
    reselectItems: (itemIds: string[]) =>
      set((state) => {
        state.deselectAll();
        state.selectItems(itemIds);
        return {};
      }),
    deslectItems: (itemIds: string[]) =>
      set((state) => {
        const selectedItemIds = new Set(state.selectedItemIds);
        itemIds.forEach((itemId) => {
          selectedItemIds.delete(itemId);
        });
        return {
          selectedItemIds,
        };
      }),
    selectAll: () =>
      set(() => {
        const currentDirIdPath =
          useNavigationStore.getState().currentNavigationPiece.idPath;
        const currentDir = useUserStore
          .getState()
          .getOrUpdateItem(currentDirIdPath);
        if (!checkIsFolder(currentDir)) {
          throw new Error("Directory is not available");
        }
        const selectedItemIds = new Set(
          currentDir.contents.map((item) => item.id)
        );
        return { selectedItemIds };
      }),
    deselectAll: () => {
      set(() => ({ selectedItemIds: new Set() }));
    },
    checkItemSelected: (itemId: string) => {
      let isItemSelected = false;
      set((state) => {
        isItemSelected = state.selectedItemIds.has(itemId);
        return {};
      });
      return isItemSelected;
    },
  } satisfies State & Action;
});

export default useSelectionStore;
