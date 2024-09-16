import React from "react";
import Image from "next/image";

const Header: React.FC = () => {
  return (
    <header className="flex justify-between items-center bg-blue-500 p-4 text-white">
      <Image
        src="/dswd.png"
        alt="Profile"
        width={200}
        height={100}
        className=""
      />
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
