import { create } from "zustand";
import { SortOption, ViewOption } from "./types";
import Color from "@/pages/Main/Sidebar/colors";
import useUserStore from "../user";

type State = {
  sort: SortOption | undefined;
  filter: Color | undefined;
  view: ViewOption;
  passwordEditorMode: boolean;
};

type Action = {
  setSort: (value: SortOption | undefined) => void;
  setFilter: (value: Color | undefined) => void;
  setView: (value: ViewOption) => void;
  setPasswordEditorMode: (value?: boolean) => void;
};

const useExplorerStore = create<State & Action>((set) => {
  const reset = () => {
    set({
      sort: undefined,
      filter: undefined,
      view: "GRID",
      passwordEditorMode: false,
    } satisfies State);
  };

  useUserStore.subscribe((state) => {
    if (!state.userDirectory) reset();
  });

  return {
    sort: undefined,
    filter: undefined,
    view: "GRID",
    passwordEditorMode: false,
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
