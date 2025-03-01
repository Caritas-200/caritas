import React from "react";
import Header from "@/app/components/Header";
import LeftNav from "@/app/components/Nav";

interface DefaultLayoutTypes {
  children: React.ReactNode;
}

export const MainLayout: React.FC<DefaultLayoutTypes> = ({ children }) => {
  return (
    <main className="flex flex-col h-screen w-full">
      <div className="shadow-md w-full">
        <Header />
      </div>
      <div className="flex flex-1 overflow-hidden p-2">
        <div className="h-full">
          <LeftNav />
        </div>
        <div className="flex-1 p-4 bg-bg-color overflow-auto">{children}</div>
      </div>
    </main>
  );
};
