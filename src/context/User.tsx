import Color from "@/pages/Main/Sidebar/colors";
import { createContext, useContext, useEffect, useState } from "react";

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

export type UserV1Type =
  | {
      displayName: string;
      username: string;
      usesPassword: boolean;
      userData: {
        directory: Folder;
        favourites: string[];
        tagged: {
          [K in Color]: Set<string>;
        };
      };
      credential: string;
      avatarHex: `0x${string}`;
    }
  | undefined;

export type SafeUserV1Type = Exclude<UserV1Type, undefined>;

type UserV1ContextType =
  | [
      UserV1Type,
      React.Dispatch<React.SetStateAction<UserV1Type>>,
      <K extends keyof SafeUserV1Type>(
        property: K,
        value: SafeUserV1Type[K]
      ) => void
    ];

const UserContext = createContext<UserV1ContextType | null>(null);

export const UserContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<UserV1Type>();

  const setUserProperty = <K extends keyof SafeUserV1Type>(
    property: K,
    value: SafeUserV1Type[K]
  ) => {
    if (!user) return;
    setUser({
      ...user,
      [property]: value,
    });
  };

  return (
    <UserContext.Provider value={[user, setUser, setUserProperty]}>
      {children}
    </UserContext.Provider>
  );
};

const useUserContext = () => {
  const ctx = useContext(UserContext);
  if (ctx === null) {
    throw new Error("useUserContext must be used inside UserContextProvider");
  }
  return ctx;
};

export default useUserContext;
