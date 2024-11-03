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
          className="text-blue-500 bg-slate-200 p-2 rounded-full"
          onClick={toggleDropdown} // Toggle dropdown on click
        >
          <Image
            src="/profile.svg"
            alt="Profile"
            width={32}
            height={32}
            className="rounded-full"
          />
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded-md shadow-lg z-10">
            <button
              onClick={handleLogout} // Call handleLogout on click
              className="block w-full text-left px-4 py-2 hover:bg-gray-200"
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
