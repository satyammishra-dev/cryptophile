import Color from "@/pages/Main/Sidebar/colors";
import { Path } from ".";

export type PasswordOperations = {
  create: (name: string, path: Path) => void;
  favourite: () => void;
  checkFavourite: () => boolean;
  delete: () => void;
  setTag: () => void;
  getTag: () => Color | undefined;
};
