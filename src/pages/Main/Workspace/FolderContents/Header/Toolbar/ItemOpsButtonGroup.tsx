import DeleteItemsButtonWrapper from "@/components/common/delete-items-button-wrapper";
import { Button } from "@/components/ui/button";
import useExplorer from "@/context/Explorer";
import React from "react";

const ItemOpsButtonGroup = () => {
  const {
    selection: { selectedItemIds },
  } = useExplorer();

  const noSelection = selectedItemIds.size === 0;
  return (
    <div className="flex items-center gap-1">
      <Button size={"sm"} variant={"outline"} disabled={noSelection}>
        <i className="text-base fa-regular fa-star"></i>
      </Button>
      <Button size={"sm"} variant={"outline"} disabled={noSelection}>
        <i className="text-base fa-regular fa-tag"></i>
      </Button>
      <DeleteItemsButtonWrapper>
        <Button size={"sm"} variant={"outline"} disabled={noSelection}>
          <i className="text-base fa-regular fa-trash text-destructive"></i>
        </Button>
      </DeleteItemsButtonWrapper>
    </div>
  );
};

export default ItemOpsButtonGroup;
