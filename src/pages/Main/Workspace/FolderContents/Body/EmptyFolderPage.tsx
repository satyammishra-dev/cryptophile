import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import React, { useState } from "react";
import {
  NewFolderDialog,
  NewPasswordItemDialog,
} from "../Header/Toolbar/NewItemButton";
import useExplorer from "@/context/Explorer";

const EmptyFolder = () => {
  const [isFolderDialogOpen, setIsFolderDialogOpen] = useState(false);
  const closeFolderDialog = () => {
    setIsFolderDialogOpen(false);
  };
  const [isPasswordItemDialogOpen, setIsPasswordItemDialogOpen] =
    useState(false);
  const closePasswordItemDialog = () => {
    setIsPasswordItemDialogOpen(false);
  };
  const { singularOps } = useExplorer();

  return (
    <div className="flex flex-col flex-1 items-center justify-center">
      <i className="fa-solid fa-empty-set text-7xl text-foreground/20"></i>
      <div className="text-muted-foreground mt-6">This folder is empty.</div>
      <div className="mt-6 flex items-center gap-2">
        <Dialog
          open={isFolderDialogOpen}
          onOpenChange={(value) => setIsFolderDialogOpen(value)}
        >
          <DialogTrigger>
            <Button size={"sm"} variant={"secondary"}>
              <span>
                <i className="fa-regular fa-folder mr-2"></i>
              </span>
              New Folder
            </Button>
          </DialogTrigger>
          <NewFolderDialog
            createFolder={singularOps.createFolder}
            close={closeFolderDialog}
          />
        </Dialog>

        <Dialog
          open={isPasswordItemDialogOpen}
          onOpenChange={(value) => setIsPasswordItemDialogOpen(value)}
        >
          <DialogTrigger>
            <Button size={"sm"}>
              <span>
                <i className="fa-regular fa-key mr-2"></i>
              </span>
              New Password
            </Button>
          </DialogTrigger>
          <NewPasswordItemDialog
            createPasswordItem={singularOps.createPassword}
            close={closePasswordItemDialog}
          />
        </Dialog>
      </div>
    </div>
  );
};

export default EmptyFolder;
