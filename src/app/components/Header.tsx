import React from "react";
import Image from "next/image";

const Header: React.FC = () => {
  return (
    <header className="flex justify-between items-center bg-blue-500 p-4 text-white ">
      <div className="flex items-center gap-2">
        <Image
          src="/mswdologo.png"
          alt="Profile"
          width={45}
          height={45}
          className=""
        />
        <h1 className="font-extrabold text-5xl text-[#2E3192]">MSWDO</h1>
      </div>

      <button className="text-blue-500 bg-slate-200 p-2 rounded-full">
        <Image
          src="/profile.svg"
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
