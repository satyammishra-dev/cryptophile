import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const safeParse = (data: string): any => {
  try {
    return JSON.parse(data);
  } catch (error) {
    throw error;
  }
};
