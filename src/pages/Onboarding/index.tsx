import React, { useEffect, useRef, useState } from "react";
import Intro from "./Intro";
import NewUser from "./NewUser";
import Security from "./NewUser/Security";
import ExistingUser from "./ExistingUser";
import autoAnimate from "@formkit/auto-animate";
import useUserList from "@/hooks/useUserList";
import useGlobalNavigator from "@/context/GlobalNavigator";

type OnboardingProps = {
  defaultStage?: number;
};

const Onboarding = ({ defaultStage }: OnboardingProps) => {
  const userList = useUserList();

  const currentRouteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    currentRouteRef.current && autoAnimate(currentRouteRef.current);
  }, [currentRouteRef]);

  const { currentRouteItem } = useGlobalNavigator();

  return (
    <div
      style={{
        background: "white",
        backgroundImage:
          "radial-gradient(rgb(var(--foreground) / 0.5) 1px, transparent 0)",
        backgroundSize: "36px 36px",
        backgroundPosition: "-16px -16px",
      }}
      className="w-full h-full flex items-center justify-center"
    >
      <div
        className="rounded-2xl border botder-border p-6 w-[400px] shadow-xl flex flex-col items-center bg-background"
        ref={currentRouteRef}
      >
        {currentRouteItem === "home" ? (
          <Intro />
        ) : currentRouteItem === "onboarding/new" ? (
          <NewUser />
        ) : currentRouteItem === "onboarding/existing" ? (
          <ExistingUser userList={userList} />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
