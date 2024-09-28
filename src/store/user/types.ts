export const ColorMap = {
  GREEN: "34 197 94",
  RED: "239 68 68",
  AMBER: "245 158 11",
  BLUE: "59 130 246",
  VIOLET: "99 102 241",
} as const;

export type Color = keyof typeof ColorMap;

export type Folder = {
  title: string;
  id: string;
  contents: Array<Folder | PasswordItem>;
  description: string;
  created: Date;
  lastModified: Date;
  tag?: Color;
  isFavourite: boolean;
};

export type PasswordItem = {
  title: string;
  id: string;
  website?: string;
  username: string;
  password: string;
  description: string;
  created: Date;
  lastModified: Date;
  tag?: Color;
  isFavourite: boolean;
};

type UserDataV1 = {
  directory: Folder;
  favourites: string[];
  tagged: {
    [K in Color]: Set<string>;
  };
};

export type UserData = UserDataV1;

export type UserV1 = {
  displayName: string;
  username: string;
  usesPassword: boolean;
  userData: UserData;
  credential: string;
  avatarHex: `0x${string}`;
  version?: never;
};

export type UserV2 =
  | Omit<Exclude<UserV1, undefined>, "version"> & { version: 2 };

export type User = UserV2;
