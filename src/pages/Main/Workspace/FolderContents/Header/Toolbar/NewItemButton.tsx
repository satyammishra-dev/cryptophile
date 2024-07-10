import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useExplorer from "@/context/Explorer";
import { getItemByPath } from "@/lib/explorer-utils";
import React from "react";

const NewItemButton = () => {
  const { singularOps } = useExplorer();
  const { createFolder, createPassword } = singularOps;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size={"sm"}>
          <i className="fa-regular fa-plus-circle mr-2"></i> <span>New</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={() => {
            createFolder("New");
          }}
        >
          <span className="w-6">
            <i className="fa-regular fa-folder"></i>
          </span>
          Folder
        </DropdownMenuItem>
        <DropdownMenuItem>
          <span className="w-6">
            <i className="fa-regular fa-key"></i>
          </span>
          Password
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NewItemButton;
