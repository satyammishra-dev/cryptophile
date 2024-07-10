import React from "react";
import Sidebar from "./Sidebar";
import Workspace from "./Workspace";

const Main = () => {
  return (
    <div className="flex w-full h-full">
      <Sidebar />
      <div className="flex flex-col w-full">
        <Workspace />
      </div>
    </div>
  );
};

export default Main;
