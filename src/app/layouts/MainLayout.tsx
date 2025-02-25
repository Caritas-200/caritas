import React from "react";

interface DefaultLayoutTypes {
  children: React.ReactNode;
}

export const MainLayout: React.FC<DefaultLayoutTypes> = ({ children }) => {
  return <div className="h-dvh overflow-clip bg-bg-color">{children}</div>;
};
