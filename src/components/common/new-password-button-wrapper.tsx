import React, { useState } from "react";
import { Dialog, DialogTrigger } from "../ui/dialog";
import { NewPasswordItemDialog } from "@/pages/Main/Workspace/FolderContents/Header/Toolbar/NewItemButton";
import useExplorer from "@/context/Explorer";

const NewPasswordButtonWrapper = ({
  children,
}: {
  children: React.ReactElement<React.ButtonHTMLAttributes<HTMLButtonElement>>;
}) => {
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const closePasswordDialog = () => {
    setIsPasswordDialogOpen(false);
  };
  const { singularOps } = useExplorer();

  return (
    <Dialog
      open={isPasswordDialogOpen}
      onOpenChange={(value) => setIsPasswordDialogOpen(value)}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <NewPasswordItemDialog
        createPasswordItem={singularOps.createPassword}
        close={closePasswordDialog}
      />
    </Dialog>
  );
};

export default NewPasswordButtonWrapper;
