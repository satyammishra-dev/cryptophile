import useUserStore from "@/store/user";
import { create } from "zustand";
import { IdPath, NavigationPiece } from "./types";

type State = {
  backStack: NavigationPiece[];
  forwardStack: NavigationPiece[];
  currentNavigationPiece: NavigationPiece;
};

type Action = {
  push: (
    navigationPiece: NavigationPiece,
    selectionItemId?: string,
    clearStack?: boolean
  ) => void;
  pop: (selectionItemId?: "_" | string) => void;
  unpop: (selectionItemId?: "_" | string) => void;
};

const DEFAULT_PATH: IdPath = [];

const useNavigationStore = create<State & Action>((set) => {
  useUserStore.subscribe(({ userDirectory }) => {
    if (!userDirectory) {
      set({
        currentNavigationPiece: { idPath: DEFAULT_PATH },
        backStack: [],
        forwardStack: [],
      });
    }
  });

  return {
    currentNavigationPiece: { idPath: DEFAULT_PATH },
    backStack: [],
    forwardStack: [],
    push: (
      navigationPiece: NavigationPiece,
      selectionItemId?: string,
      clearStack?: boolean
    ) => {
      set((state) => {
        const currentIdPath = [...state.currentNavigationPiece.idPath];
        const sourceId = currentIdPath.pop() as string;
        const newState = {
          currentNavigationPiece: {
            idPath: navigationPiece.idPath,
            sourceId: navigationPiece.sourceId ?? sourceId,
          },
          backStack: clearStack
            ? []
            : [...state.backStack, state.currentNavigationPiece],
          forwardStack: [],
        } satisfies Partial<State & Action>;
        return newState;
      });
      if (selectionItemId) {
        set((state) => {
          console.log(
            "find",
            selectionItemId,
            "in",
            state.currentNavigationPiece
          );
          return {};
        });
      }
    },
    pop: (selectionItemId?: "_" | string) => {
      set((state) => {
        if (state.backStack.length === 0) return {};
        const backStackTemp = [...state.backStack];
        const lastNavPiece = backStackTemp.pop() as NavigationPiece;
        const newState = {
          backStack: [...backStackTemp],
          currentNavigationPiece: lastNavPiece,
          forwardStack: [state.currentNavigationPiece, ...state.forwardStack],
        } satisfies Partial<State & Action>;
        console.log("old", state, "new", newState);
        return newState;
      });
      set((state) => {
        selectionItemId =
          selectionItemId === "_"
            ? state.currentNavigationPiece.sourceId
            : selectionItemId;
        if (selectionItemId) {
          // Select
          console.log(
            "find",
            selectionItemId,
            "in",
            state.currentNavigationPiece
          );
        }
        return {};
      });
    },
    unpop: (selectionItemId?: "_" | string) => {
      set((state) => {
        if (state.forwardStack.length === 0) return {};
        const [nextNavPiece, ...forwardStackTemp] = [...state.forwardStack];
        const newState = {
          backStack: [...state.backStack, state.currentNavigationPiece],
          currentNavigationPiece: nextNavPiece,
          forwardStack: [...forwardStackTemp],
        } satisfies Partial<State & Action>;
        return newState;
      });
      set((state) => {
        selectionItemId =
          selectionItemId === "_"
            ? state.currentNavigationPiece.sourceId
            : selectionItemId;
        if (selectionItemId) {
          // Select
          console.log(
            "find",
            selectionItemId,
            "in",
            state.currentNavigationPiece
          );
        }
        return {};
      });
    },
  } as State & Action;
});

export default useNavigationStore;
