import React from "react";
import Header from "@/app/components/Header";
import LeftNav from "@/app/components/Nav";

interface DefaultLayoutTypes {
  children: React.ReactNode;
}

export const MainLayout: React.FC<DefaultLayoutTypes> = ({ children }) => {
  return (
    <main className="w-full h-screen">
      <div className="shadow-md">
        <Header />
      </div>
      <div className="flex flex-row flex-1 p-4 gap-4">
        <LeftNav />
        <div className="w-full">
          <div className=" overflow-clip bg-bg-color">{children}</div>
        </div>
      </div>
    </main>
  );
};
