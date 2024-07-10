import React from "react";
import Header from "./Header";
import Body from "./Body";

const FolderContents = () => {
  return (
    <div className="flex-1 h-full flex flex-col">
      <Header />
      <Body />
    </div>
  );
};

export default FolderContents;
