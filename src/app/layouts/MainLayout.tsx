import React from "react";
import Header from "@/app/components/Header";
import LeftNav from "@/app/components/Nav";

interface DefaultLayoutTypes {
  children: React.ReactNode;
}

export const MainLayout: React.FC<DefaultLayoutTypes> = ({ children }) => {
  return (
    <main className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <LeftNav />
        <div className="flex-1 p-4 bg-bg-color overflow-auto">{children}</div>
      </div>
    </main>
  );
};
