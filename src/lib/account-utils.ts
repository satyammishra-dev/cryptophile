import { Folder, SafeUserV1Type, UserV1Type } from "@/context/User";
import {
  arrayToHex,
  decrypt,
  encrypt,
  generateSHA256,
} from "./cryptographic-utils";
import { safeParse } from "./utils";
import Color, { ColorMap } from "@/pages/Main/Sidebar/colors";

const VERSION = "1";

export type CryptophileData = {
  version: 1;
  users: CryptophileUsers;
};

export type CryptophileUsers = {
  [key: string]: CryptophileUserData;
};

export type CryptophileUserData =
  | ["1", string, `0x${string}`, string, string, string]
  | ["0", string, `0x${string}`, string];

export const defaultCryptophileData = {
  version: 1,
  users: {},
} as CryptophileData;

export const defaultCryptophileDataString = JSON.stringify(
  defaultCryptophileData
);

export const INITIAL_DIRECTORY = (): Folder => {
  return {
    title: "Home",
    id: "home",
    description: "",
    contents: [
      {
        title: "Websites",
        id: "websites",
        contents: [],
        description: "Store all the passwords to be used in websites here.",
        created: new Date(),
        lastModified: new Date(),
        isFavourite: false,
      },
      {
        title: "Wi-Fi",
        id: "wi-fi",
        contents: [],
        description: "Store all Wi-Fi passwords to be used in websites here.",
        created: new Date(),
        lastModified: new Date(),
        isFavourite: false,
      },
      {
        title: "Banks",
        id: "banks",
        contents: [],
        description:
          "Store all the passwords associated to bank accounts here.",
        created: new Date(),
        lastModified: new Date(),
        isFavourite: false,
      },
      {
        title: "Crypto",
        id: "crypto",
        contents: [],
        description:
          "Store all the passwords and keys associated to crypto wallets here.",
        created: new Date(),
        lastModified: new Date(),
        isFavourite: false,
      },
    ],
    created: new Date(),
    lastModified: new Date(),
    isFavourite: false,
  };
};

export const INITIAL_USER_DATA = (): SafeUserV1Type["userData"] => {
  const directory = INITIAL_DIRECTORY();
  type ColorTags = SafeUserV1Type["userData"]["tagged"];
  return {
    directory,
    favourites: [],
    tagged: Object.keys(ColorMap).reduce<ColorTags>((acc, color) => {
      acc[color as Color] = new Set();
      return acc;
    }, {} as ColorTags),
  };
};

export const createUserWithPassword = async (
  username: string,
  displayName: string,
  avatarHex: string,
  privateKey: string,
  password: string
) => {
  let cryptophileDataString = localStorage.getItem("cryptophile-data");
  if (!cryptophileDataString || cryptophileDataString === "") {
    cryptophileDataString = defaultCryptophileDataString;
    localStorage.setItem("cryptophile-data", defaultCryptophileDataString);
  }

  let cryptophileData;
  try {
    cryptophileData = safeParse(cryptophileDataString) as CryptophileData;
  } catch {
    throw new Error(
      "There was an error creating the account. Try clearing the cookies."
    );
  }

  if (username in cryptophileData.users)
    throw new Error("User already exists.");
  if (password.length > 256)
    throw new Error("Password cannot be greater than 256 characters.");

  const SHAedPassword = generateSHA256(password);
  const SHAedSHAedPassword = generateSHA256(SHAedPassword);

  const encryptedPrivateKey = await encrypt(privateKey, SHAedSHAedPassword);
  const encryptedDisplayName = await encrypt(displayName, privateKey);
  const data = INITIAL_USER_DATA();
  const encryptedData = await encrypt(JSON.stringify(data), privateKey);

  const userAuthType = "1";
  const userData = [
    userAuthType,
    encryptedDisplayName,
    avatarHex,
    encryptedPrivateKey,
    SHAedPassword,
    encryptedData,
  ] as CryptophileUserData;

  cryptophileData.users[username] = userData;

  cryptophileDataString = JSON.stringify(cryptophileData);
  localStorage.setItem("cryptophile-data", cryptophileDataString);
};

export const createUserWithPrivateKey = async (
  username: string,
  displayName: string,
  avatarHex: string,
  privateKey: string
) => {
  let cryptophileDataString = localStorage.getItem("cryptophile-data");
  if (!cryptophileDataString || cryptophileDataString === "") {
    cryptophileDataString = JSON.stringify({
      version: 1,
      users: {},
    } as CryptophileData);
    localStorage.setItem("cryptophile-data", cryptophileDataString);
  }

  let cryptophileData;
  try {
    cryptophileData = safeParse(cryptophileDataString) as CryptophileData;
  } catch {
    throw new Error(
      "There was an error creating the account. Try clearing the cookies."
    );
  }

  if (username in cryptophileData.users)
    throw new Error("User already exists.");

  const encryptedDisplayName = await encrypt(displayName, privateKey);
  const data = INITIAL_USER_DATA();
  const encryptedData = await encrypt(JSON.stringify(data), privateKey);

  const userAuthType = "0";
  const userData = [
    userAuthType,
    encryptedDisplayName,
    avatarHex,
    encryptedData,
  ] as CryptophileUserData;

  cryptophileData.users[username] = userData;

  cryptophileDataString = JSON.stringify(cryptophileData);
  localStorage.setItem("cryptophile-data", cryptophileDataString);
};

export const authenticateUserWithPassword = async (
  username: string,
  password: string
) => {
  let cryptophileDataString = localStorage.getItem("cryptophile-data");
  if (!cryptophileDataString || cryptophileDataString === "") {
    cryptophileDataString = defaultCryptophileDataString;
    localStorage.setItem("cryptophile-data", defaultCryptophileDataString);
  }

  let cryptophileData;
  try {
    cryptophileData = safeParse(cryptophileDataString) as CryptophileData;
  } catch {
    throw new Error("There was an error authenticating. Try refreshing.");
  }
  if (!(username in cryptophileData.users))
    throw new Error("User does not exist.");

  const user = cryptophileData.users[username];

  if (user[0] === "0")
    throw new Error("Password encryption does not exist on this user.");

  const SHAedPassword = generateSHA256(password);
  if (SHAedPassword !== user[4])
    throw new Error("Password is incorrect. Please try again.");

  const SHAedSHAedPassword = generateSHA256(SHAedPassword);
  const privateKey = await decrypt(user[3], SHAedSHAedPassword);
  const displayName = await decrypt(user[1], privateKey);
  const data = await decrypt(user[5], privateKey);
  return [displayName, data];
};

export const authenticateUserWithPrivateKey = async (
  username: string,
  privateKey: string
) => {
  let cryptophileDataString = localStorage.getItem("cryptophile-data");
  if (!cryptophileDataString || cryptophileDataString === "") {
    cryptophileDataString = defaultCryptophileDataString;
    localStorage.setItem("cryptophile-data", defaultCryptophileDataString);
  }

  let cryptophileData;
  try {
    cryptophileData = safeParse(cryptophileDataString) as CryptophileData;
  } catch {
    throw new Error("There was an error authenticating. Try refreshing.");
  }
  if (!(username in cryptophileData.users))
    throw new Error("User does not exist.");

  const user = cryptophileData.users[username];

  if (user[0] === "1")
    throw new Error("Private Key encryption does not exist on this user.");

  const displayName = await decrypt(user[1], privateKey);
  const data = await decrypt(user[3], privateKey);

  return [displayName, data];
};

export const generateAvatarHex = (): `0x${string}` => {
  const array = new Uint8Array(32);
  window.crypto.getRandomValues(array);
  return arrayToHex(array) as `0x${string}`;
};
