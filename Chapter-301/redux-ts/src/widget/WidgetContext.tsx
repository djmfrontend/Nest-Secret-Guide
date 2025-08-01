import { createContext, useContext, type FC } from "react";

interface IWidgetContext {
  color: string;
  title: string;
  //
}

const WidgetContext = createContext<IWidgetContext | undefined>(undefined); // 数据仓库

const WidgetProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <WidgetContext.Provider
      value={{
        color: "#1fe1f9",
        title: "Chat Room",
      }}
    >
      {children}
    </WidgetContext.Provider>
  );
};

function useWidget() {
  const context = useContext(WidgetContext);
  if (context === undefined) {
    throw new Error("useWidget must be used within a WidgetProvider");
  }
  return context;
}

export { WidgetProvider, useWidget };
