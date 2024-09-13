import React from "react";
import Image from "next/image";

const Header: React.FC = () => {
  return (
    <header className="flex justify-between items-center bg-blue-500 p-4 text-white">
      <div className="text-2xl font-bold">CARITAS</div>
      <button className="bg-white text-blue-500 p-2 rounded-full">
        <Image
          src="/path-to-profile-icon.png"
          alt="Profile"
          width={32}
          height={32}
          className="rounded-full"
        />
      </button>
    </header>
  );
};

export default Header;
