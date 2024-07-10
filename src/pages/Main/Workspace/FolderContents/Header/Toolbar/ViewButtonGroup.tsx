import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipProvider,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import React from "react";

type ViewButtonGroupProps = {
  viewModeState: [number, React.Dispatch<React.SetStateAction<number>>];
};

const ViewButtonGroup = ({ viewModeState }: ViewButtonGroupProps) => {
  const [viewMode, setViewMode] = viewModeState;
  return (
    <div className="flex p-0.5 gap-0.5 border border-border/0 hover:border-border transition duration-500 rounded-lg">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size={"sm"}
              className="w-12"
              variant={viewMode === 0 ? "secondary" : "ghost"}
              onClick={() => setViewMode(0)}
            >
              <i className="fa-regular fa-grid text-base"></i>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Grid View</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size={"sm"}
              className="w-12"
              variant={viewMode === 1 ? "secondary" : "ghost"}
              onClick={() => setViewMode(1)}
            >
              <i className="fa-regular fa-list text-base"></i>
            </Button>
          </TooltipTrigger>
          <TooltipContent>List View</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default ViewButtonGroup;
