import React, { ReactNode, createContext, useContext, useState } from 'react';

interface NavBarContextType {
  account: string | undefined;
  setAccount: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const NavBarContext = createContext<NavBarContextType>({
  account: '',
  setAccount: () => {},
});

interface LayoutProps {
  children: ReactNode;
}

export const useNavBarAccount = () => useContext(NavBarContext);

export const NavBarProvider: React.FC<LayoutProps> = ({ children }) => {
  const [account, setAccount] = useState<string | undefined>('');

  return (
    <NavBarContext.Provider value={{ account, setAccount }}>
      {children}
    </NavBarContext.Provider>
  );
};
