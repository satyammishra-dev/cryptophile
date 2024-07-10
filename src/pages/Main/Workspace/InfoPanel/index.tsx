import React from "react";
import FolderInfo from "./FolderInfo";
import PasswordInfo from "./PasswordInfo";

const InfoPanel = () => {
  return (
    <div className="w-[25%] min-w-[300px] border-l border-l-border h-full px-4 py-4">
      <FolderInfo />
    </div>
  );
};

export default InfoPanel;
