import { Button } from "@/components/ui/button";
import CompoundInput from "@/components/ui/compound-input";
import useGlobalNavigator from "@/context/GlobalNavigator";
import {
  createUserWithPassword,
  createUserWithPrivateKey,
} from "@/lib/account-utils";
import {
  decrypt,
  encrypt,
  generatePrivateKey,
  generateSHA256,
} from "@/lib/cryptographic-utils";
import React, { useState } from "react";

type SecurityProps = {
  goBack: () => void;
  accountInfo: {
    privateKey: string;
    displayName: string;
    username: string;
    avatarHex: string;
  };
};

const Security = ({ goBack, accountInfo }: SecurityProps) => {
  const { goTo } = useGlobalNavigator();
  const { privateKey, username, displayName, avatarHex } = accountInfo;
  const [securityMode, setSecurityMode] = useState(0);
  const [agreement, setAgreement] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [showPrivateKey, setShowPrivateKey] = useState(false);

  const [isUserCreating, setUserCreating] = useState(false);

  const validatePassword = (password: string): string => {
    if (password === "") return "empty";
    if (password.length < 8) return "short";
    if (password === "password") return "easy";
    if (password === "12345678") return "easy";
    if (password === username) return "easy";
    if (password === displayName) return "easy";
    return "";
  };

  const handleCreateUser = async () => {
    if (isUserCreating) return;
    if (securityMode === 0) {
      setUserCreating(true);
      await createUserWithPrivateKey(
        username,
        displayName,
        avatarHex,
        privateKey
      );
      setUserCreating(false);
    } else if (securityMode === 1) {
      if (validatePassword(password) !== "") return;
      setUserCreating(true);
      await createUserWithPassword(
        username,
        displayName,
        avatarHex,
        privateKey,
        password
      );

      setUserCreating(false);
    }
    goTo("onboarding/existing");
  };

  // const test = async () => {
  //   const pk = generatePrivateKey();
  //   const shaed = generateSHA256(pk);
  //   const encrypted = await encrypt("hello", pk);
  //   const decrypted = await decrypt(encrypted, pk);

  //   console.log({ pk, shaed, encrypted, decrypted });
  // };

  // test();

  return (
    <>
      <div className="flex items-center w-full gap-2">
        <Button
          onClick={goBack}
          size={"sm"}
          variant={"ghost"}
          disabled={isUserCreating}
        >
          <i className="fa-regular fa-chevron-left"></i>
        </Button>
        <h1 className="font-bold text-xl">Security</h1>
      </div>
      <div className="flex p-1 gap-1 border border-border rounded-xl mt-4">
        <Button
          size={"sm"}
          className="w-32 relative"
          variant={securityMode === 0 ? "default" : "ghost"}
          onClick={() => setSecurityMode(0)}
          disabled={isUserCreating}
        >
          Private Key
          <div
            className={`uppercase rounded-full ${
              securityMode === 0
                ? "bg-primary-foreground/85 text-primary"
                : "bg-primary/85 text-primary-foreground"
            } backdrop-blur-sm px-2 py-1 text-xs absolute -top-2 -left-2 scale-75 origin-top-left pointer-events-none`}
          >
            Recommended
          </div>
        </Button>
        <Button
          size={"sm"}
          className="w-32"
          variant={securityMode === 1 ? "default" : "ghost"}
          onClick={() => setSecurityMode(1)}
          disabled={isUserCreating}
        >
          Password
        </Button>
      </div>
      <div className="w-full mb-6 mt-8">
        {securityMode === 1 ? (
          <>
            <h2>
              Create a password. You would be asked for this password each time
              you access the application.
            </h2>
            <div className="flex flex-col mt-4 w-full">
              <CompoundInput
                className="flex-1"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                value={password}
                onChange={(evt) => setPassword(evt.target.value)}
                autoComplete="new-password"
                disabled={isUserCreating}
              >
                <Button
                  variant={"ghost"}
                  className="shrink-none w-16"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? "Hide" : "Show"}
                </Button>
              </CompoundInput>
              {["short", "easy"].includes(validatePassword(password)) && (
                <span className="mt-2 mx-1 text-destructive text-sm">
                  <i className="fa-regular fa-circle-exclamation mr-2"></i>
                  {validatePassword(password) === "short"
                    ? "Password must be at least 8 characters long."
                    : validatePassword(password) === "easy"
                    ? "Password is too easy to be guessed."
                    : ""}
                </span>
              )}
            </div>
          </>
        ) : (
          <>
            <h2>
              You would be asked for the private key each time you access the
              application. Store this key at a secure physical location.
            </h2>
            <div className="border border-border rounded-lg flex flex-col items-center gap-2 p-2 mt-3">
              <span
                className={`block break-all px-2 font-mono text-sm ${
                  showPrivateKey ? "" : "blur-sm"
                }`}
              >
                {privateKey}
              </span>
              <Button
                size={"sm"}
                variant={"ghost"}
                onClick={() => setShowPrivateKey((prev) => !prev)}
              >
                Click to {showPrivateKey ? "hide" : "show"}
              </Button>
            </div>
          </>
        )}
      </div>
      <input
        type="checkbox"
        id="password-agreement"
        className="cursor-pointer opacity-100 hidden"
        checked={agreement}
        onChange={() => setAgreement((prev) => !prev)}
        aria-hidden="true"
        disabled={isUserCreating}
      />{" "}
      <label
        htmlFor="password-agreement"
        className="cursor-pointer select-none flex items-center gap-4 mt-5 text-sm"
      >
        <span className="w-8 flex items-center justify-center">
          {agreement ? (
            <i className="fa-solid fa-circle-check text-lg"></i>
          ) : (
            <i className="fa-regular fa-circle text-base"></i>
          )}
        </span>
        <span>
          I am aware that no one, not even Cryptophile can recover my{" "}
          {securityMode === 1 ? "password" : "private key"} for me.
        </span>
      </label>
      <div className="w-full flex items-center justify-end mt-8 gap-2">
        <Button
          disabled={
            isUserCreating ||
            !agreement ||
            (securityMode === 1 ? validatePassword(password) !== "" : false)
          }
          onClick={handleCreateUser}
        >
          {isUserCreating && (
            <>
              <i className="fa-regular fa-spinner-third animate-spin mr-2"></i>
            </>
          )}
          {isUserCreating ? "Finishing..." : "Finish"}
        </Button>
      </div>
    </>
  );
};

export default Security;
