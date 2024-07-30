import { createContext, useContext, useState, type ReactNode } from "react";

type authContextType = {
  user: any;
  login: () => void;
  logout: () => void;
  setUser: (user: any) => void;
};

const appContextDefaultValues: authContextType = {
  user: false,
  login: () => {},
  logout: () => {},
  setUser: () => {},
};

const AppContext = createContext<authContextType>(appContextDefaultValues);

export function useApp() {
  return useContext(AppContext);
}

type Props = {
  children: ReactNode;
};

export function AppProvider({ children }: Props) {
  const [user, setUser] = useState<boolean>();

  const login = () => {
    setUser(true);
  };

  const logout = () => {
    setUser(false);
  };

  const value = {
    user,
    login,
    logout,
    setUser,
  };

  return (
    <>
      <AppContext.Provider value={value}>{children}</AppContext.Provider>
    </>
  );
}
