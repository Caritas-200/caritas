import React from "react";
import Header from "@/app/components/Header";
import LeftNav from "@/app/components/Nav";
import Calendar from "@/app/components/Calendar";
import { MainLayout } from "@/app/layouts/MainLayout";

const HomeDashboard: React.FC = () => {
  return (
    <MainLayout>
      <Header />
      <div className="flex flex-row flex-1 bg-gray-700">
        <LeftNav />
        <div className="w-full overflow-y-auto p-4 h-svh pb-24">
          <Calendar />
        </div>
      </div>
    </MainLayout>
  );
};

export default HomeDashboard;
