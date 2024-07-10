import { Button } from "@/components/ui/button";
import useGlobalNavigator from "@/context/GlobalNavigator";
import React from "react";

const Intro = () => {
  const { goTo } = useGlobalNavigator();
  return (
    <>
      <div className="w-full flex flex-col items-center">
        <img
          src="/assets/images/icon-textured.png"
          alt=""
          className="h-16 mt-4"
        />
        <h1 className="font-bold text-2xl mt-6">Cryptophile</h1>
        <h2 className="text-center px-4 mt-4">
          <span className="font-bold">Cryptophile</span> is an{" "}
          <span className="font-bold">RSA Encrypted Password Manager</span> that
          stores your passwords privately and securely.
        </h2>
      </div>
      <Button className="mt-6" onClick={() => goTo("onboarding/new")}>
        Get Started
      </Button>
    </>
  );
};

export default Intro;
