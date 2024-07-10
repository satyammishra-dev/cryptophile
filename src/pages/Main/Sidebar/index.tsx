import useUserContext from "@/context/User";
import React from "react";
import UserOptions from "./UserOptions";
import FolderTable from "./FolderTable";
import Color, { ColorMap } from "./colors";
import ColorTag from "./ColorTag";

const Sidebar = () => {
  const [user] = useUserContext();
  return (
    <div className="min-w-[240px] bg-foreground/5 border-r border-r-border h-full">
      <div className="flex flex-col h-full justify-between">
        <div className="flex flex-col p-3 gap-4">
          <UserOptions />
          <div className="flex flex-col gap-1">
            <div className="font-bold text-sm p-1">
              <span className="">Favourites</span>
              <div className="bg-foreground/5 rounded-md px-3 py-3 text-center mt-2">
                <span className="text-muted-foreground font-normal">
                  Your favourites appear here.
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="font-bold text-sm p-1">
              <span>Folders</span>
            </div>
            {user && <FolderTable />}
          </div>
          <div className="flex flex-col gap-1">
            <div className="font-bold text-sm p-1">
              <span className="">Color Tags</span>
              <div className="rounded-md px-1 py-1 mt-2 flex gap-1">
                {Object.keys(ColorMap).map((key) => {
                  return (
                    <ColorTag
                      rgbString={ColorMap[key as Color]}
                      key={key}
                      isChecked
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="flex p-4 items-center justify-between">
          <img
            src="/assets/images/icon-textured.png"
            className="h-5 opacity-80"
            alt=""
          />
          <span className="text-sm text-muted-foreground">
            <b>Cryptophile</b> v1.0
          </span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
