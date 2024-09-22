import Color from "@/pages/Main/Sidebar/colors";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

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

export type UserV1Type =
  | {
      displayName: string;
      username: string;
      usesPassword: boolean;
      userData: UserData;
      credential: string;
      avatarHex: `0x${string}`;
      version?: never;
    }
  | undefined;

export type UserV2Type =
  | (Omit<Exclude<UserV1Type, undefined>, "version"> & { version: 2 })
  | undefined;
export type SafeUserV2Type = Exclude<UserV2Type, undefined>;

type UserV2ContextType =
  | [
      UserV2Type,
      React.Dispatch<React.SetStateAction<UserV2Type>>,
      <K extends keyof SafeUserV2Type>(
        property: K,
        value: SafeUserV2Type[K]
      ) => void
    ];

const UserContext = createContext<UserV2ContextType | null>(null);

const ensureUserDataCompatibility = <
  T extends Exclude<UserV1Type | UserV2Type, undefined>
>(
  user: T
) => {
  const userVersion = user.version ?? 1;

  // ================ ADJUSTMENTS FOR STR TO OBJ =====================
  const handleTaggedSets = (user: T): T => {
    const tagged = user.userData.tagged;
    if (!tagged) return user;
    const newTagged = Object.keys(tagged).reduce((acc, key) => {
      const typedKey = key as keyof typeof tagged;
      const originalVal: any = tagged[typedKey];
      if (userVersion === 1 || Object.keys(originalVal).length === 0) {
        acc[typedKey] = new Set();
      } else if (userVersion === 2) {
        acc[typedKey] = new Set(originalVal as Array<string> | Set<string>);
      } else {
        acc[typedKey] = new Set();
      }
      return acc;
    }, {} as SafeUserV2Type["userData"]["tagged"]);
    return { ...user, userData: { ...user.userData, tagged: newTagged } };
  };

  const updateVersion = (user: T): SafeUserV2Type => {
    if (user.version) {
      if (user.version === 2) {
        return user;
      }
    }
    return { ...user, version: 2 };
  };

  const tagHandledUser = handleTaggedSets(user);
  const backwardsCompatibleUser = updateVersion(tagHandledUser);
  return backwardsCompatibleUser;
};

export const UserContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<UserV2Type>();

  const setUserWithDataCompatibility: React.Dispatch<
    React.SetStateAction<UserV2Type>
  > = useCallback(
    (value) => {
      setUser((prev) => {
        let userObj;
        if (typeof value === "function") {
          userObj = value(prev);
        } else {
          userObj = value;
        }
        if (!userObj) return undefined;
        return ensureUserDataCompatibility(userObj);
      });
    },
    [setUser]
  );

  const setUserProperty = <K extends keyof SafeUserV2Type>(
    property: K,
    value: SafeUserV2Type[K]
  ) => {
    if (!user) return;
    setUserWithDataCompatibility({
      ...user,
      [property]: value,
    });
  };

  return (
    <UserContext.Provider
      value={[user, setUserWithDataCompatibility, setUserProperty]}
    >
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
