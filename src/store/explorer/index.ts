import { create } from "zustand";
import { FilterOptions, SortOption, ViewOption } from "./types";
import useUserStore from "../user";
import { Color } from "../user/types";

type State = {
  sort: SortOption | undefined;
  filter: FilterOptions;
  view: ViewOption;
  passwordEditorMode: boolean;
};

type Action = {
  setSort: (value: SortOption | undefined) => void;
  setFilter: (value: FilterOptions) => void;
  setView: (value: ViewOption) => void;
  setPasswordEditorMode: (value?: boolean) => void;
};

const DEFAULT_STATE = {
  sort: undefined,
  filter: {
    favourites: {
      favourited: false,
      unfavourited: false,
    },
    tags: {
      AMBER: false,
      BLUE: false,
      GREEN: false,
      RED: false,
      VIOLET: false,
      none: false,
    },
  },
  view: "GRID",
  passwordEditorMode: false,
} satisfies State;

const useExplorerStore = create<State & Action>((set) => {
  const reset = () => {
    set(DEFAULT_STATE);
  };

  useUserStore.subscribe((state) => {
    if (!state.userDirectory) reset();
  });

  return {
    sort: DEFAULT_STATE.sort,
    filter: DEFAULT_STATE.filter,
    view: DEFAULT_STATE.view,
    passwordEditorMode: DEFAULT_STATE.passwordEditorMode,
    setSort: (value) => set({ sort: value }),
    setFilter: (value) => set({ filter: value }),
    setView: (value) => set({ view: value }),
    setPasswordEditorMode: (value?: boolean) =>
      set((state) => ({
        passwordEditorMode: value ?? !state.passwordEditorMode,
      })),
  } satisfies State & Action;
});

export default useExplorerStore;
