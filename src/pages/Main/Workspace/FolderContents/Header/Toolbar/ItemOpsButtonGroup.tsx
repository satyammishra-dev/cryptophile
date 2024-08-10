import DeleteItemsButtonWrapper from "@/components/common/delete-items-button-wrapper";
import { Button } from "@/components/ui/button";
import useExplorer from "@/context/Explorer";
import React, { useEffect, useRef } from "react";

const ItemOpsButtonGroup = () => {
  const {
    selection: { selectedItemIds },
    batchOps: {
      getItemsTagByMajority,
      checkFavouriteByMajority,
      markFavouriteByMajority,
    },
  } = useExplorer();

  const noSelection = selectedItemIds.size === 0;

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
      {checkFavouriteByMajority() ? (
        <Button
          size={"sm"}
          variant={"default"}
          disabled={noSelection}
          onClick={() => {
            markFavouriteByMajority();
          }}
        >
          <i className="text-base fa-solid fa-star"></i>
        </Button>
      ) : (
        <Button
          size={"sm"}
          variant={"outline"}
          disabled={noSelection}
          onClick={() => {
            markFavouriteByMajority();
          }}
        >
          <i className="text-base fa-regular fa-star"></i>
        </Button>
      )}
      {/* </Button> */}
      <Button size={"sm"} variant={"outline"} disabled={noSelection}>
        <i className="text-base fa-regular fa-tag"></i>
      </Button>
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
