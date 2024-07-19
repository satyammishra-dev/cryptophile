import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useEffect, useRef, useState } from "react";
import NewItemButton from "./NewItemButton";
import ViewButtonGroup from "./ViewButtonGroup";
import FilterButton from "./FilterButton";
import useExplorer from "@/context/Explorer";

const Toolbar = () => {
  const viewModeState = useState(0);
  const [viewMode, setViewMode] = viewModeState;
  const {
    selection: { selectionMode, setSelectionMode, deselectAll },
    navigation: { currentDirectoryIdPath },
  } = useExplorer();
  const isInitialRender = useRef(true);

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
    } else {
      deselectAll();
      setSelectionMode(false);
    }
  }, [currentDirectoryIdPath]);

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
        <div className="flex items-center gap-1">
          <Button size={"sm"} variant={"outline"}>
            <i className="text-base fa-regular fa-star"></i>
          </Button>
          <Button size={"sm"} variant={"outline"}>
            <i className="text-base fa-regular fa-tag"></i>
          </Button>
          <Button size={"sm"} variant={"outline"}>
            <i className="text-base fa-regular fa-trash text-destructive"></i>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
