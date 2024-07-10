export const ColorMap = {
  GREEN: "34 197 94",
  RED: "239 68 68",
  AMBER: "245 158 11",
  BLUE: "59 130 246",
  VIOLET: "99 102 241",
} as const;

type Color = keyof typeof ColorMap;
export default Color;
