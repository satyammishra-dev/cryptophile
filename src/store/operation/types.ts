import { Folder, PasswordItem } from "@/context/User";
import { IdPath } from "../navigation/types";
import { Color } from "../user/types";

export type DeletedItem = {
  data: Folder | PasswordItem;
  favouritedIdPathStrings: Set<string>;
  tagged: {
    [key in Color]?: Set<string>;
  };
};

export type DeletionData = {
  parentPath: IdPath;
  deletedItems: DeletedItem[];
};
