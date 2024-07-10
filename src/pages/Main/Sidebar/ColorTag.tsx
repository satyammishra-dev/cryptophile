import React from "react";

type ColorTagProps = {
  rgbString: string;
  isChecked: boolean;
};

const ColorTag = ({ rgbString, isChecked = false }: ColorTagProps) => {
  return (
    <button
      className="h-6 w-6 rounded-full border-2 border-foreground/10 inline-flex items-center justify-center"
      style={{
        background: `rgb(${rgbString})`,
      }}
    >
      {isChecked && (
        <i className="fa-solid fa-check text-sm text-foreground/50"></i>
      )}
    </button>
  );
};

export default ColorTag;
