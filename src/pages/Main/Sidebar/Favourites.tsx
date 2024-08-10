import { Button } from "@/components/ui/button";
import useExplorer from "@/context/Explorer";
import { NavigationProps } from "@/context/Explorer/Navigation";
import useUserContext, { Folder, PasswordItem } from "@/context/User";
import { getItemByPath, parseIdPathString } from "@/lib/explorer-utils";
import React, { useEffect, useState } from "react";

const FavouriteItem = ({
  item,
  idPath,
  push,
  selectSingleItemById,
}: {
  item: Folder | PasswordItem;
  idPath: string[];
  push: (
    navigationProps: NavigationProps,
    clearStack?: boolean,
    selectionItemId?: string
  ) => void;
  selectSingleItemById: (id: string) => void;
}) => {
  const [idToSelect, setIdToSelect] = useState<string>();

  const selectPasswordItem = () => {
    const idPathTemp = [...idPath];
    const itemId = idPathTemp.pop();
    if (!itemId) return;
    push({ path: idPathTemp, sourceId: undefined }, false, itemId);
    // setIdToSelect(itemId);
  };

  // useEffect(() => {
  //   if (idToSelect) {
  //     selectSingleItemById(idToSelect);
  //     setIdToSelect(undefined);
  //   }
  // }, [idToSelect]);

  return (
    <button
      className="w-full hover:bg-primary/5 flex items-center justify-start rounded-md py-1 px-2"
      onClick={() => {
        if ("contents" in item) {
          push({ path: idPath, sourceId: undefined });
        } else {
          selectPasswordItem();
        }
      }}
    >
      <span className="w-4 text-primary/80">
        {"contents" in item ? (
          <i className="fa-solid fa-folder"></i>
        ) : (
          <i className="fa-solid fa-key"></i>
        )}
      </span>
      <span className="ml-2">{item.title}</span>
    </button>
  );
};

const Favourites = () => {
  const [user] = useUserContext();
  const {
    root,
    selection: { selectSingleItemById },
    navigation: { push },
  } = useExplorer();
  const favourites = user?.userData.favourites ?? ([] as string[]);
  return (
    <ul>
      {root && favourites.length > 0 ? (
        <div className="rounded-md text-center">
          {favourites.map((idPathStr) => {
            const idPath = parseIdPathString(idPathStr);
            const item = getItemByPath(idPath, root);
            if (item) {
              return (
                <FavouriteItem
                  item={item}
                  idPath={idPath}
                  push={push}
                  selectSingleItemById={selectSingleItemById}
                />
              );
            }
            return null;
          })}
        </div>
      ) : (
        <div className="bg-foreground/5 rounded-md px-3 py-3 text-center mt-2">
          <span className="text-muted-foreground font-normal">
            Your favourites appear here.
          </span>
        </div>
      )}
    </ul>
  );
};

export default Favourites;
