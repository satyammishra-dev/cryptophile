import React, { useState } from "react";
import { Dialog, DialogTrigger } from "../ui/dialog";
import { NewFolderDialog } from "@/pages/Main/Workspace/FolderContents/Header/Toolbar/NewItemButton";
import useExplorer from "@/context/Explorer";

const NewFolderButtonWrapper = ({
  children,
}: {
  children: React.ReactElement<React.ButtonHTMLAttributes<HTMLButtonElement>>;
}) => {
  const [isFolderDialogOpen, setIsFolderDialogOpen] = useState(false);
  const closeFolderDialog = () => {
    setIsFolderDialogOpen(false);
  };
  const { singularOps } = useExplorer();

  return (
    <Dialog
      open={isFolderDialogOpen}
      onOpenChange={(value) => setIsFolderDialogOpen(value)}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <NewFolderDialog
        createFolder={singularOps.createFolder}
        close={closeFolderDialog}
      />
    </Dialog>
  );
};

export default NewFolderButtonWrapper;
