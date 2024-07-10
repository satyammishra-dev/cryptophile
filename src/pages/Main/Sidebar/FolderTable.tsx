import React from "react";
import Color from "./colors";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { PopoverContent } from "@radix-ui/react-popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useUserContext, { Folder, UserV1Type } from "@/context/User";
import useExplorer from "@/context/Explorer";

type FolderProps = {
  folderData: Folder;
  isActive?: boolean;
} & React.HTMLAttributes<HTMLButtonElement>;

const FolderItem = ({
  folderData,
  isActive = false,
  ...props
}: FolderProps) => {
  return (
    <button
      className={`w-full ${
        isActive ? "bg-foreground/10" : "hover:bg-foreground/5"
      } inline-flex items-center gap-2 rounded-md px-2 py-1 group justify-between`}
      {...props}
    >
      <div className="flex items-center gap-2">
        <i
          className={`fa-solid fa-folder-closed ${
            isActive ? "text-foreground" : "text-foreground/60"
          } group-hover:text-foreground`}
        ></i>
        <span>{folderData.title}</span>
      </div>
      <div className="flex items-center gap-2 mr-1 pointer-events-none opacity-0 group-hover:pointer-events-auto group-hover:opacity-100 focus-within:opacity-100">
        <i className="text-sm fa-regular fa-pen text-muted-foreground hover:text-foreground "></i>
        <i className="text-sm fa-regular fa-trash text-muted-foreground hover:text-destructive "></i>
      </div>
    </button>
  );
};

type FolderTableProps = {
  // foldersData: Folder[];
};

const FolderTable = ({}: FolderTableProps) => {
  const [user, , setUserKey] = useUserContext();
  const { navigation, root: homeDirectory } = useExplorer();
  const currentDirIdPath = navigation.currentDirectoryIdPath;

  return (
    <>
      {homeDirectory?.contents.map((item) => {
        if ("password" in item) return;
        return (
          <FolderItem
            folderData={item}
            isActive={
              currentDirIdPath !== undefined &&
              currentDirIdPath.length > 0 &&
              currentDirIdPath[1] === item.id
            }
            onClick={() => {
              navigation.push(["home", item.id]);
            }}
            key={item.id}
          />
        );
      })}
      <Popover>
        <PopoverTrigger asChild>
          <button className="w-full bg-foreground/5 hover:bg-foreground/10 text-sm py-1.5 rounded-lg mt-2">
            <i className="fa-solid fa-circle-plus mr-1"></i> New Folder
          </button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="bg-background/80 backdrop-blur-md p-2 rounded-lg border border-border shadow-lg mt-1">
            <div>
              <Input type="text" className="h-8" placeholder="Folder Name" />
            </div>
            <div className="mt-2 flex justify-end">
              <Button size={"sm"} className="">
                Add
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default FolderTable;
