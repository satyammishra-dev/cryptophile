import { CryptophileData, defaultCryptophileData } from "@/lib/account-utils";
import { safeParse } from "@/lib/utils";
import React from "react";
import { useLocalStorage } from "@uidotdev/usehooks";

const useIsValidUsername = (username: string): boolean => {
  const [cryptophileData] = useLocalStorage(
    "cryptophile-data",
    defaultCryptophileData
  );
  return !(username in cryptophileData.users);
};

export default useIsValidUsername;
