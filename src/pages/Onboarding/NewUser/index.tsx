import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import Security from "./Security";
import { generatePrivateKey } from "@/lib/cryptographic-utils";
import Avatar from "@/components/common/avatar";
import { Input } from "@/components/ui/input";
import useIsValidUsername from "@/hooks/useIsValidUsername";
import { generateAvatarHex } from "@/lib/account-utils";
import useGlobalNavigator from "@/context/GlobalNavigator";

const NewUser = () => {
  const { goBack, goTo, backStackLength } = useGlobalNavigator();
  const setExistingUserStage = () => goTo("onboarding/existing");
  const [privateKey] = useState(generatePrivateKey());
  const [avatarHex, setAvatarHex] = useState(generateAvatarHex);

  const [step, setStep] = useState(0);
  const setStep1 = () => setStep(0);
  const goNext = () => setStep(1);

  const refreshAvatar = () => {
    setAvatarHex(generateAvatarHex());
  };

  const [displayNameVal, setDisplayNameVal] = useState("");
  const [usernameVal, setUsernameVal] = useState("");

  const [
    shouldGenerateUsernameFromDisplayName,
    setShouldGenerateUsernameFromDisplayName,
  ] = useState(true);

  const generateUsernameFromDisplayName = (displayName: string) => {
    if (!shouldGenerateUsernameFromDisplayName) return;
    const lowercase = displayName.toLowerCase();
    const userName = lowercase.replaceAll(" ", ".");
    setUsernameVal(userName);
  };

  const isValidUsername = useIsValidUsername(usernameVal);

  const validateUsername = (): string => {
    if (usernameVal === "") return "empty";
    if (!isValidUsername) return "exists";
    return "";
  };

  return (
    <>
      {step === 1 ? (
        <Security
          goBack={setStep1}
          accountInfo={{
            privateKey,
            displayName: displayNameVal,
            username: usernameVal,
            avatarHex,
          }}
        />
      ) : (
        <>
          <div className="flex items-center w-full gap-2">
            {backStackLength > 0 && (
              <Button onClick={goBack} size={"sm"} variant={"ghost"}>
                <i className="fa-regular fa-chevron-left"></i>
              </Button>
            )}
            <h1 className="font-bold text-xl">New Account</h1>
          </div>
          <div className="w-full mt-6 flex flex-col items-center">
            <div className="relative p-1 border-4 border-primary rounded-full inline-flex items-center justify-center">
              <Avatar address={avatarHex} size={90} />
              <button
                className="absolute flex items-center justify-center bottom-0 right-0 h-8 w-8 bg-primary-foreground/70 text-primary backdrop-blur-sm rounded-full shadow-sm transition duration-500 active:scale-95 active:rotate-180 focus:border focus:border-primary"
                onClick={refreshAvatar}
              >
                <i className="fa-regular fa-refresh"></i>
              </button>
            </div>
            <div className="mt-6 w-full px-4 flex flex-col gap-2">
              <Input
                className="text-base"
                type="text"
                placeholder="Display Name"
                value={displayNameVal}
                onChange={(evt) => {
                  const value = evt.target.value;
                  setDisplayNameVal(value);
                  generateUsernameFromDisplayName(value);
                }}
              />
              <Input
                className="text-base"
                type="text"
                placeholder="Username"
                value={usernameVal}
                onChange={(evt) => {
                  setShouldGenerateUsernameFromDisplayName(false);
                  setUsernameVal(evt.target.value);
                }}
              />
              {["exists"].includes(validateUsername()) && (
                <span className="mt-2 mx-1 text-destructive text-sm">
                  <i className="fa-regular fa-circle-exclamation mr-2"></i>
                  {validateUsername() === "exists"
                    ? "This username already exists."
                    : ""}
                </span>
              )}
            </div>
          </div>
          <div className="w-full flex items-center justify-between mt-10">
            <Button onClick={setExistingUserStage} variant={"outline"}>
              Login existing account
            </Button>
            <Button
              onClick={goNext}
              disabled={displayNameVal === "" || validateUsername() !== ""}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </>
  );
};

export default NewUser;
