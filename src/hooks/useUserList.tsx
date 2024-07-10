import { CryptophileData, defaultCryptophileData } from "@/lib/account-utils";
import { safeParse } from "@/lib/utils";
import { useLocalStorage } from "@uidotdev/usehooks";
import React from "react";

export type UserListItem = {
  username: string;
  authType: "0" | "1";
  avatarHex: `0x${string}`;
};

const useUserList = (): UserListItem[] => {
  const [cryptophileData] = useLocalStorage(
    "cryptophile-data",
    defaultCryptophileData
  );
  //   if (cryptophileDataString === "") return [];
  //   let cryptophileData;
  //   if (typeof cryptophileDataString === "object") {
  //     cryptophileData = cryptophileDataString;
  //   } else {
  //     try {
  //       cryptophileData = safeParse(cryptophileDataString) as CryptophileData;
  //     } catch {
  //       throw new Error("An error occured. Try clearing your cookies.");
  //     }
  //   }

  const cryptophileUsers = cryptophileData.users;
  const userList = Object.keys(cryptophileUsers).map((username) => {
    const user = cryptophileUsers[username];
    const authType = user[0];
    const avatarHex = user[2];
    return { username, authType, avatarHex };
  });
  return userList;
};

export default useUserList;
