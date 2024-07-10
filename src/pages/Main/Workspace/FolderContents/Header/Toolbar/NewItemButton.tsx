import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { TextArea } from "@/components/ui/textarea";
import useExplorer from "@/context/Explorer";
import { useState } from "react";

export const NewFolderDialog = ({
  createFolder,
  close,
}: {
  createFolder: (name: string, path?: string[]) => void;
  close: () => void;
}) => {
  const [folderName, setFolderName] = useState("New Folder");
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          <i className="fa-solid fa-folder mr-2"></i> New Folder
        </DialogTitle>
        <DialogDescription>Create a new folder</DialogDescription>
      </DialogHeader>
      <div className="w-full flex flex-col gap-3 mt-4">
        <div className="w-full flex flex-col gap-2">
          <span className="font-bold text-sm">Name</span>
          <Input
            placeholder={"Folder Name"}
            value={folderName}
            onChange={(evt) => setFolderName(evt.target.value)}
          />
        </div>
        <div className="w-full flex flex-col gap-2">
          <span className="font-bold text-sm">Description</span>
          <TextArea
            className="resize-none h-20"
            placeholder="How do you plan to use this folder?"
          ></TextArea>
        </div>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant={"outline"}>Cancel</Button>
        </DialogClose>
        <Button
          onClick={() => {
            createFolder(folderName);
            close();
          }}
        >
          Create
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

const NewItemButton = () => {
  const { singularOps } = useExplorer();
  const { createFolder, createPassword } = singularOps;
  const [isFolderDialogOpen, setIsFolderDialogOpen] = useState(false);
  const closeFolderDialog = () => {
    setIsFolderDialogOpen(false);
  };
  return (
    <Dialog
      open={isFolderDialogOpen}
      onOpenChange={(value) => setIsFolderDialogOpen(value)}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size={"sm"}>
            <i className="fa-regular fa-plus-circle mr-2"></i> <span>New</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DialogTrigger asChild>
            <DropdownMenuItem>
              <span className="w-6">
                <i className="fa-regular fa-folder"></i>
              </span>
              Folder
            </DropdownMenuItem>
          </DialogTrigger>
          <DropdownMenuItem>
            <span className="w-6">
              <i className="fa-regular fa-key"></i>
            </span>
            Password
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <NewFolderDialog createFolder={createFolder} close={closeFolderDialog} />
    </Dialog>
  );
};

export default NewItemButton;
