import DeleteItemsButtonWrapper from "@/components/common/delete-items-button-wrapper";
import { Button } from "@/components/ui/button";
import useExplorer from "@/context/Explorer";
import { ColorMap } from "@/pages/Main/Sidebar/colors";
import React, { useEffect, useRef } from "react";
import TagButton from "./TagButton";

const ItemOpsButtonGroup = () => {
  const {
    selection: { selectedItemIds },
    batchOps: {
      getItemsTagByMajority,
      setItemsTag,
      checkFavouriteByMajority,
      markFavouriteByMajority,
    },
  } = useExplorer();

  const noSelection = selectedItemIds.size === 0;
  const isFavouriteByMajority = checkFavouriteByMajority();
  const itemsTagByMajority = getItemsTagByMajority();

  const deleteButtonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const keyDownHandler = (evt: KeyboardEvent) => {
      const { key, shiftKey, ctrlKey, altKey, metaKey } = evt;
      if (shiftKey || ctrlKey || altKey || metaKey) return;
      if (key !== "Delete") return;
      deleteButtonRef.current && deleteButtonRef.current.click();
    };
    document.addEventListener("keydown", keyDownHandler);

    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, []);

  return (
    <div className="flex items-center gap-1">
      <Button
        size={"sm"}
        variant={isFavouriteByMajority ? "default" : "outline"}
        disabled={noSelection}
        onClick={() => {
          markFavouriteByMajority();
        }}
      >
        <i
          className={`text-base fa-${
            isFavouriteByMajority ? "solid" : "regular"
          } fa-star`}
        ></i>
      </Button>
      {/* </Button> */}
      <TagButton
        disabled={noSelection}
        value={itemsTagByMajority}
        handleChange={(value) => {
          setItemsTag(value);
        }}
      />

      <DeleteItemsButtonWrapper>
        <Button
          size={"sm"}
          variant={"outline"}
          disabled={noSelection}
          ref={deleteButtonRef}
        >
          <i className="text-base fa-regular fa-trash text-destructive"></i>
        </Button>
      </DeleteItemsButtonWrapper>
    </div>
  );
};

export default ItemOpsButtonGroup;
