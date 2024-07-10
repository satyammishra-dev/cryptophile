import useUserContext, { Folder, PasswordItem } from "@/context/User";
import React, { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Toolbar from "./Toolbar";
import useExplorer from "@/context/Explorer";

const Header = () => {
  const [user] = useUserContext();

  const { navigation } = useExplorer();
  const currentDirIdPath = navigation.currentDirectoryIdPath;
  const homeDirectory = user?.userData.directory;

  const getDirectoryNamePath = (): string[] => {
    if (!homeDirectory || currentDirIdPath.length === 0) return [];

    let initialContents: (Folder | PasswordItem)[] = [homeDirectory];
    const namePath: string[] = [];
    for (let i = 0; i < currentDirIdPath.length; i++) {
      const currentItem = initialContents.find(
        (item) => item.id === currentDirIdPath[i]
      );
      if (!currentItem) return [];
      if (!("contents" in currentItem)) return [];
      namePath.push(currentItem.title);
      initialContents = [...currentItem.contents];
    }

    return namePath;
  };

  const directoryNamePath = getDirectoryNamePath();

  return (
    <div className="w-full p-4 border-b border-b-border sticky">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" className="">
            <i className="fa-solid fa-chevron-left text-xl"></i>
          </Button>
          <Button variant="ghost" className="mr-2">
            <i className="fa-solid fa-chevron-right text-xl"></i>
          </Button>
          <h1 className="font-bold text-2xl">
            {directoryNamePath.length === 0
              ? "Home"
              : directoryNamePath.join("/")}{" "}
          </h1>
        </div>
        <div className="flex items-center">
          <Button variant="outline" className="mr-1 px-0 w-12">
            <i className="fa-solid fa-home text-xl"></i>
          </Button>
          <Button variant={"secondary"} className="px-0 w-12 group">
            <i className="fa-regular fa-compass text-lg group-hover:rotate-90 transition"></i>
          </Button>
        </div>
      </div>
      <Toolbar />
    </div>
  );
};

export default Header;
