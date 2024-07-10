import { Button } from "@/components/ui/button";
import useExplorer from "@/context/Explorer";
import useUserContext from "@/context/User";
import { getItemByPath } from "@/lib/explorer-utils";
import React from "react";

type InfoTileProps = React.HTMLAttributes<HTMLDivElement> & {
  heading: React.ReactNode;
  toolbox?: React.ReactNode;
  children: React.ReactNode;
};

const InfoTile = ({ heading, children, toolbox, ...props }: InfoTileProps) => {
  return (
    <div
      {...props}
      className={`bg-foreground/5 flex flex-col gap-2 rounded-lg p-2 px-3 ${props.className} group`}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{heading}</span>
        <div className="opacity-50 focus-within:opacity-100 group-hover:opacity-100">
          {toolbox}
        </div>
      </div>
      <div className="w-full">{children}</div>
    </div>
  );
};

const PasswordInfo = () => {
  const [user] = useUserContext();
  const { navigation } = useExplorer();

  const currentDirIdPath = navigation.currentDirectoryIdPath;
  const homeDirectory = user?.userData.directory;
  const folderData = homeDirectory
    ? getItemByPath(currentDirIdPath, homeDirectory)
    : undefined;

  return (
    <div className="w-full">
      <div className="w-full py-8 flex flex-col items-center">
        <div className=" h-[100px] w-[100px] rounded-2xl flex items-center justify-center">
          <i className="fa-solid fa-key text-8xl text-foreground/20"></i>
        </div>
        <div className="font-bold text-xl mt-4">{folderData?.title}</div>
        <div className="flex items-center gap-2 mt-4">
          <Button
            variant={"secondary"}
            size={"sm"}
            className="rounded-full h-10 w-10 inline-flex items-center justify-center"
          >
            <i className="fa-regular fa-pen"></i>
          </Button>
          <Button
            variant={"secondary"}
            size={"sm"}
            className="rounded-full h-10 w-10 inline-flex items-center justify-center"
          >
            <i className="fa-regular fa-star"></i>
          </Button>
          <Button
            variant={"secondary"}
            size={"sm"}
            className="rounded-full h-10 w-10 inline-flex items-center justify-center"
          >
            <i className="fa-regular fa-tag"></i>
          </Button>
        </div>
        <div className="w-full mt-10 grid grid-cols-2 gap-2">
          <InfoTile
            heading={
              <>
                <i className="fa-solid fa-globe mr-2"></i>
                <span className="font-bold">Website</span>
              </>
            }
            toolbox={
              <div className="w-full text-foreground/50 gap-3 flex">
                <button className="text-sm hover:text-foreground/80">
                  <i className="fa-solid fa-copy"></i>
                </button>
                <button className="text-sm hover:text-foreground/80">
                  <i className="fa-solid fa-link"></i>
                </button>
                <button className="text-sm hover:text-foreground/80">
                  <i className="fa-solid fa-pen"></i>
                </button>
              </div>
            }
            className=" col-span-2"
          >
            <div className="w-full font-bold">{"https://www.google.com"}</div>
          </InfoTile>
          <InfoTile
            heading={
              <>
                <i className="fa-solid fa-user mr-2"></i>
                <span className="font-bold">Username</span>
              </>
            }
            toolbox={
              <div className="w-full text-foreground/50 gap-3 flex">
                <button className="text-sm hover:text-foreground/80">
                  <i className="fa-solid fa-copy"></i>
                </button>
                <button className="text-sm hover:text-foreground/80">
                  <i className="fa-solid fa-pen"></i>
                </button>
              </div>
            }
            className=" col-span-2"
          >
            <div className="w-full font-bold">{"@satyammishra"}</div>
          </InfoTile>
          <InfoTile
            heading={
              <>
                <i className="fa-solid fa-key mr-2"></i>
                <span className="font-bold">Password</span>
              </>
            }
            toolbox={
              <div className="w-full text-foreground/50 gap-3 flex">
                <button className="text-sm hover:text-foreground/80">
                  <i className="fa-solid fa-copy"></i>
                </button>
                <button className="text-sm hover:text-foreground/80">
                  <i className="fa-solid fa-eye"></i>
                </button>
                <button className="text-sm hover:text-foreground/80">
                  <i className="fa-solid fa-pen"></i>
                </button>
              </div>
            }
            className=" col-span-2"
          >
            <input
              className="w-full font-bold bg-transparent border-0 outline-none"
              type="password"
              value={"        "}
              disabled
            />
          </InfoTile>
        </div>
        <div className="w-full mt-6 grid grid-cols-2 gap-2">
          <InfoTile
            heading={
              <>
                <i className="fa-solid fa-circle-info mr-2"></i>
                <span className="font-bold">About</span>
              </>
            }
            className=" col-span-2 mb-4"
          >
            <div className="w-full">{folderData?.description}</div>
          </InfoTile>
          <InfoTile
            heading={
              <>
                <i className="fa-solid fa-calendar-circle-plus mr-2"></i>
                <span className="font-bold">Created</span>
              </>
            }
          >
            <div className="w-full text-right font-bold text-lg">Now</div>
          </InfoTile>
          <InfoTile
            heading={
              <>
                <i className="fa-solid fa-clock mr-2"></i>
                <span className="font-bold">Last Modified</span>
              </>
            }
          >
            <div className="w-full text-right font-bold text-lg">Now</div>
          </InfoTile>
          <InfoTile
            heading={
              <>
                <i className="fa-solid fa-compass mr-2"></i>
                <span className="font-bold">Location</span>
              </>
            }
            className=" col-span-2"
          >
            <div className="w-full text-right font-bold text-base">Home</div>
          </InfoTile>
        </div>
      </div>
    </div>
  );
};

export default PasswordInfo;
