import { Button } from "@/components/ui/button";
import React from "react";

const EmptyFolder = () => {
  return (
    <div className="flex flex-col flex-1 items-center justify-center">
      <i className="fa-solid fa-empty-set text-7xl text-foreground/20"></i>
      <div className="text-muted-foreground mt-6">This folder is empty.</div>
      <div className="mt-6 flex items-center gap-2">
        <Button size={"sm"} variant={"secondary"}>
          {" "}
          <span>
            <i className="fa-regular fa-folder mr-2"></i>
          </span>
          New Folder
        </Button>
        <Button size={"sm"}>
          {" "}
          <span>
            <i className="fa-regular fa-key mr-2"></i>
          </span>{" "}
          New Password
        </Button>
      </div>
    </div>
  );
};

export default EmptyFolder;
