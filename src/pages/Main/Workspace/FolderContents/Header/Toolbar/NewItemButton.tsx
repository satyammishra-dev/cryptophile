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
  createFolder: (name: string, path?: string[]) => string;
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

export const NewPasswordItemDialog = ({
  createPasswordItem,
  close,
}: {
  createPasswordItem: (
    name: string,
    path?: string[],
    username?: string,
    password?: string
  ) => string;
  close: () => void;
}) => {
  const {
    selection: { selectSingleItemById },
  } = useExplorer();
  const [passwordItemName, setPasswordItemName] = useState("New Password");
  const handleCreatePassword = () => {
    try {
      const id = createPasswordItem(passwordItemName);
      // setTimeout(() => {
      //   selectSingleItemById(id);
      // }, 10000);
    } catch (e) {
      alert("Error while creating password");
      console.error(e);
    }
    close();
  };
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          <i className="fa-solid fa-folder mr-2"></i> New Password
        </DialogTitle>
        <DialogDescription>Create a new password</DialogDescription>
      </DialogHeader>
      <div className="w-full flex flex-col gap-3 mt-4">
        <div className="w-full flex flex-col gap-2">
          <span className="font-bold text-sm">Name</span>
          <Input
            placeholder={"Password Name"}
            value={passwordItemName}
            onChange={(evt) => setPasswordItemName(evt.target.value)}
          />
        </div>
        <div className="w-full flex flex-col gap-2">
          <span className="font-bold text-sm">Description</span>
          <TextArea
            className="resize-none h-20"
            placeholder="Add some description or notes about the password."
          ></TextArea>
        </div>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant={"outline"}>Cancel</Button>
        </DialogClose>
        <Button onClick={handleCreatePassword}>Create</Button>
      </DialogFooter>
    </DialogContent>
  );
};

const NewItemButton = () => {
  const { singularOps } = useExplorer();
  const { createFolder, createPassword } = singularOps;
  const [currentDialog, setCurrentDialog] = useState<
    "Folder" | "PasswordItem"
  >();
  const closeDialog = () => setCurrentDialog(undefined);
  return (
    <Dialog
      open={currentDialog !== undefined}
      onOpenChange={(value) => {
        if (!value) {
          setCurrentDialog(undefined);
        }
      }}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size={"sm"}>
            <i className="fa-regular fa-plus-circle mr-2"></i> <span>New</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DialogTrigger asChild>
            <DropdownMenuItem onClick={() => setCurrentDialog("Folder")}>
              <span className="w-6">
                <i className="fa-regular fa-folder"></i>
              </span>
              Folder
            </DropdownMenuItem>
          </DialogTrigger>
          <DropdownMenuItem onClick={() => setCurrentDialog("PasswordItem")}>
            <span className="w-6">
              <i className="fa-regular fa-key"></i>
            </span>
            Password
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {currentDialog === "Folder" ? (
        <NewFolderDialog createFolder={createFolder} close={closeDialog} />
      ) : currentDialog === "PasswordItem" ? (
        <NewPasswordItemDialog
          createPasswordItem={createPassword}
          close={closeDialog}
        />
      ) : null}
    </Dialog>
  );
};

export default NewItemButton;
