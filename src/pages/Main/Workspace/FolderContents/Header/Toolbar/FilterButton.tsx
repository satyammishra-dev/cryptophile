import { Button } from "@/components/ui/button";
import {
  DropdownMenuContent,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import Color, { ColorMap } from "@/pages/Main/Sidebar/colors";
import { ChevronsUpDown } from "lucide-react";
import React, { useState } from "react";

const FilterButton = () => {
  const [selectedColor, setSelectedColor] = useState<Color>();

  const handleClick = (value: Color) => {
    if (selectedColor === value) {
      setSelectedColor(undefined);
    } else {
      setSelectedColor(value);
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size={"sm"} variant={"outline"}>
          <i
            className={`text-base ${
              selectedColor ? "fa-solid" : "fa-regular"
            } fa-filter`}
          ></i>
          {selectedColor && (
            <div
              className="h-5 w-5 rounded-full border-2 border-foreground/10 inline-flex items-center justify-center ml-2"
              style={{
                background: `rgb(${ColorMap[selectedColor]})`,
              }}
            ></div>
          )}
          <ChevronsUpDown className="h-5 ml-2 -mr-2 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {Object.keys(ColorMap).map((color) => {
          return (
            <DropdownMenuItem
              onClick={() => handleClick(color as Color)}
              key={color}
            >
              <div
                className="h-5 w-5 rounded-full border-2 border-foreground/10 inline-flex items-center justify-center mr-2"
                style={{
                  background: `rgb(${ColorMap[color as Color]})`,
                }}
              >
                {selectedColor === color && (
                  <i className="fa-solid fa-check text-xs text-white"></i>
                )}
              </div>
              <span className="capitalize">{color.toLowerCase()}</span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FilterButton;
