import { createContext, useContext, useState } from "react";

type RouteItem = "home" | "onboarding/new" | "onboarding/existing";

type GlobalNavigatorContext = {
  currentRouteItem: RouteItem | undefined;
  backStackLength: number;
  forwardStackLength: number;
  goBack: () => void;
  goForward: () => void;
  goTo: (routeItem: RouteItem, clearBackStack?: boolean) => void;
  goHome: (clearBackStack?: boolean) => void;
};

const GlobalNavigator = createContext<GlobalNavigatorContext | null>(null);

export const GlobalNavigatorProvider = ({
  children,
  initialRouteItem,
}: {
  initialRouteItem?: RouteItem;
  children: React.ReactNode;
}) => {
  const [currentRouteItem, setCurrentRouteItem] = useState<
    RouteItem | undefined
  >(initialRouteItem);
  const [backStack, setBackStack] = useState<Array<RouteItem>>([]);
  const [forwardStack, setForwardStack] = useState<Array<RouteItem>>([]);
  const goBack = () => {
    if (backStack.length === 0) return;
    setForwardStack([
      ...forwardStack,
      currentRouteItem ? currentRouteItem : "home",
    ]);
    const backStackTemp = [...backStack];
    const poppedItems = backStackTemp.splice(-1, 1);
    const poppedItem = poppedItems[0];
    setBackStack(backStackTemp);
    setCurrentRouteItem(poppedItem);
  };

  const goForward = () => {
    if (forwardStack.length === 0) return;
    setBackStack([...backStack, currentRouteItem ? currentRouteItem : "home"]);
    const forwardStackTemp = [...forwardStack];
    const poppedItems = forwardStackTemp.splice(-1, 1);
    const poppedItem = poppedItems[0];
    setForwardStack(forwardStackTemp);
    setCurrentRouteItem(poppedItem);
  };

  const goTo = (routeItem: RouteItem, clearBackStack?: boolean) => {
    if (!clearBackStack) {
      setBackStack([
        ...backStack,
        currentRouteItem ? currentRouteItem : "home",
      ]);
    }
    setCurrentRouteItem(routeItem);
    setForwardStack([]);
  };

  const goHome = (clearBackStack?: boolean) => {
    goTo("home", clearBackStack);
  };

  return (
    <GlobalNavigator.Provider
      value={{
        currentRouteItem,
        backStackLength: backStack.length,
        forwardStackLength: forwardStack.length,
        goBack,
        goForward,
        goTo,
        goHome,
      }}
    >
      {children}
    </GlobalNavigator.Provider>
  );
};

const useGlobalNavigator = () => {
  const ctx = useContext(GlobalNavigator);
  if (!ctx) {
    throw new Error(
      "useGlobalNavigator must be used inside GlobalNavigatorProvider"
    );
  }

  return ctx;
};

export default useGlobalNavigator;
