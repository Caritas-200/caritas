import React from "react";

const Header: React.FC = () => {
  return (
    <header className="flex justify-between items-center bg-blue-500 p-4 text-white">
      <div className="text-2xl font-bold">CARITAS</div>
      <button className="bg-white text-blue-500 p-2 rounded-full">
        <img
          src="/path-to-profile-icon.png"
          alt="Profile"
          className="h-8 w-8"
        />
      </button>
    </header>
  );
};

export default Header;
