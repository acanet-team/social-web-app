import httpClient from "@/api";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

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
  session: any;
};

export function AppProvider({ children, session }: Props) {
  const [user, setUser] = useState<boolean>(session?.user);
  httpClient.setAuthorization(session?.accessToken);

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

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
