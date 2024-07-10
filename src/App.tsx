import React from "react";
import Onboarding from "./pages/Onboarding";
import useUserContext, { UserContextProvider } from "./context/User";
import useUserList from "./hooks/useUserList";
import { GlobalNavigatorProvider } from "./context/GlobalNavigator";
import Main from "./pages/Main";
import { ExplorerProvider } from "./context/Explorer";

const AppWithProviders = () => {
  return (
    <UserContextProvider>
      <ExplorerProvider>
        <AppWithGlobalNavigatorProvider />
      </ExplorerProvider>
    </UserContextProvider>
  );
};
const AppWithGlobalNavigatorProvider = () => {
  const userList = useUserList();
  return (
    <GlobalNavigatorProvider
      initialRouteItem={userList.length === 0 ? "home" : "onboarding/existing"}
    >
      <App />
    </GlobalNavigatorProvider>
  );
};

const App = () => {
  const [user, setUser] = useUserContext();

  return (
    <div className="w-full h-full">{user ? <Main /> : <Onboarding />}</div>
  );
};

export default AppWithProviders;
