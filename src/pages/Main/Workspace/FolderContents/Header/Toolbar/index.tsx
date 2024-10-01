import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useEffect, useRef, useState } from "react";
import NewItemButton from "./NewItemButton";
import ViewButtonGroup from "./ViewButtonGroup";
import FilterButton from "./FilterButton";
import ItemOpsButtonGroup from "./ItemOpsButtonGroup";
import useSelectionStore from "@/store/selection";
import useNavigationStore from "@/store/navigation";
import useUserStore from "@/store/user";

const Toolbar = () => {
  const homeDirectory = useUserStore((state) => state.userDirectory);

  const selectionMode = useSelectionStore((state) => state.selectionMode);
  const setSelectionMode = useSelectionStore((state) => state.setSelectionMode);
  const deselectAll = useSelectionStore((state) => state.deselectAll);

  const viewModeState = useState(0);

  const handleSelectionModeToggle = () => {
    if (selectionMode) {
      deselectAll();
      setSelectionMode(false);
    } else {
      setSelectionMode(true);
    }
  };
  return (
    <div className="mt-4 flex items-center justify-between">
      <Input placeholder="Search" className="h-10 max-w-[300px] rounded-lg" />
      {homeDirectory && (
        <div className="flex items-center gap-4">
          <NewItemButton />
          <ViewButtonGroup viewModeState={viewModeState} />
          <div className="flex items-center gap-1">
            <FilterButton />
            <Button size={"sm"} variant={"outline"}>
              <i className="text-base fa-regular fa-arrow-down-arrow-up"></i>
            </Button>
          </div>
          <div className="flex items-center gap-1">
            <Button
              size={"sm"}
              variant={selectionMode ? "default" : "outline"}
              onClick={handleSelectionModeToggle}
            >
              <i className="text-base fa-regular fa-location-arrow"></i>
            </Button>
          </div>
          <ItemOpsButtonGroup />
        </div>
      )}
    </div>
  );
};

export default Toolbar;
