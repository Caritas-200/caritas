import React from "react";
import Header from "@/app/components/Header";
import LeftNav from "@/app/components/Nav";
import Calendar from "@/app/components/Calendar";
import BigCalendar from "@/app/components/BigCalendar";

const HomeDashboard: React.FC = () => {
  return (
    <div className="h-screen">
      <Header />
      <div className="flex flex-row flex-1">
        <LeftNav />
        <BigCalendar />
      </div>
    </div>
  );
};

export default HomeDashboard;
