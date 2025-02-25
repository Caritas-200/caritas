import React from "react";
import Header from "@/app/components/Header";
import LeftNav from "@/app/components/Nav";
import Calendar from "@/app/components/Calendar";
import { MainLayout } from "@/app/layouts/MainLayout";

const HomeDashboard: React.FC = () => {
  return (
    <MainLayout>
      <Calendar />
    </MainLayout>
  );
};

export default HomeDashboard;
