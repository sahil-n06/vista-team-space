import { createContext, useContext, useState, ReactNode } from "react";

type SidebarType = "main" | "chat";

interface SidebarContextType {
  activeSidebar: SidebarType;
  setActiveSidebar: (sidebar: SidebarType) => void;
  showMainSidebar: () => void;
  showChatSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarManagerProvider({ children }: { children: ReactNode }) {
  const [activeSidebar, setActiveSidebar] = useState<SidebarType>("main");

  const showMainSidebar = () => setActiveSidebar("main");
  const showChatSidebar = () => setActiveSidebar("chat");

  return (
    <SidebarContext.Provider
      value={{
        activeSidebar,
        setActiveSidebar,
        showMainSidebar,
        showChatSidebar,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebarManager() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebarManager must be used within a SidebarManagerProvider");
  }
  return context;
}
