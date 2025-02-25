"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { logoutUser } from "../lib/api/auth/data";

const Header: React.FC = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false); // State for dropdown
  const router = useRouter();
  const handleLogout = async () => {
    try {
      await logoutUser();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev); // Toggle dropdown visibility
  };

  return (
    <header className="flex justify-between items-center bg-blue-500 p-4 text-white">
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

      <div className="relative">
        <button
          className=""
          onClick={toggleDropdown} // Toggle dropdown on click
        >
          <Image
            src="/p2.svg"
            alt="Profile"
            width={50}
            height={50}
            className="rounded-full shadow-md"
          />
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 w-fit mt-2  bg-white  rounded-md shadow-lg z-10 overflow-hidden">
            <button
              onClick={handleLogout} // Call handleLogout on click
              className="block w-fit text-left px-4 text-black py-2 hover:bg-red-500 hover:text-white hover:font-bold"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
