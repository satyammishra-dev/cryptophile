import { Button } from "@/components/ui/button";
import useExplorer from "@/context/Explorer";
import { getItemByPath } from "@/lib/explorer-utils";
import React from "react";
import Folder from "./Folder";
import EmptyFolder from "./EmptyFolderPage";

const Body = () => {
  const explorer = useExplorer();
  const homeDirectory = explorer.root;
  const navigation = explorer.navigation;
  const currentDirectoryIdPath = navigation.currentDirectoryIdPath;
  const directory = homeDirectory
    ? getItemByPath(currentDirectoryIdPath, homeDirectory)
    : undefined;
  return (
    <>
      {directory &&
        ("contents" in directory ? (
          <div className="flex flex-col flex-1 items-start justify-start">
            <div className="flex flex-wrap gap-1 p-4 select-none">
              {directory.contents.map((item) => {
                return "contents" in item ? (
                  <Folder folder={item} key={item.id} />
                ) : (
                  <></>
                );
              })}
            </div>
          </div>
        ) : (
          <EmptyFolder />
        ))}
    </>
  );
};

export default Body;
