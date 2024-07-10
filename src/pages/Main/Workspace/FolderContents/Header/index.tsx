import useUserContext, { Folder, PasswordItem } from "@/context/User";
import React, { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Toolbar from "./Toolbar";
import useExplorer from "@/context/Explorer";

const BreadCrumb = ({
  idPath,
  namePath,
  push,
}: {
  idPath: string[];
  namePath: string[];
  push: (path: string[], clearStack?: boolean) => void;
}) => {
  return (
    <>
      {idPath.map((itemId, idx) => {
        return (
          <Button
            variant={"ghost"}
            className="font-bold text-xl px-1"
            key={itemId}
            onClick={() => push([...idPath].slice(0, idx + 1))}
          >
            {namePath[idx]}{" "}
            {idx !== idPath.length - 1 && (
              <span>
                {" "}
                <i className="fa-solid fa-chevron-right text-lg text-muted-foreground ml-2 mr-1"></i>
              </span>
            )}
          </Button>
        );
      })}
    </>
  );
};

const Header = () => {
  const [user] = useUserContext();

  const { navigation } = useExplorer();
  const currentDirIdPath = navigation.currentDirectoryIdPath;
  const homeDirectory = user?.userData.directory;

  const [isBreadCrumbMode, setBreadCrumbMode] = useState(false);

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
          <Button
            variant="ghost"
            className=""
            disabled={navigation.stack.length === 1}
            onClick={() => {
              navigation.pop();
            }}
          >
            <i className="fa-solid fa-chevron-left text-xl"></i>
          </Button>
          <Button
            variant="ghost"
            disabled={navigation.forwardStack.length === 0}
            className="mr-2"
            onClick={() => {
              navigation.unpop();
            }}
          >
            <i className="fa-solid fa-chevron-right text-xl"></i>
          </Button>
          {isBreadCrumbMode ? (
            <BreadCrumb
              namePath={directoryNamePath}
              idPath={currentDirIdPath}
              push={navigation.push}
            />
          ) : (
            <h1 className="font-bold text-2xl">
              {directoryNamePath[directoryNamePath.length - 1]}
            </h1>
          )}
        </div>
        <div className="flex items-center">
          <Button
            variant={currentDirIdPath.length === 1 ? "ghost" : "outline"}
            onClick={() => navigation.push(["home"])}
            className="mr-1 px-0 w-12"
          >
            <i className="fa-solid fa-home text-xl"></i>
          </Button>
          <Button
            variant={isBreadCrumbMode ? "secondary" : "outline"}
            onClick={() => setBreadCrumbMode((prev) => !prev)}
            className="px-0 w-12 group"
          >
            <i className="fa-regular fa-compass text-lg group-hover:rotate-90 transition"></i>
          </Button>
        </div>
      </div>
      <Toolbar />
    </div>
  );
};

export default Header;
