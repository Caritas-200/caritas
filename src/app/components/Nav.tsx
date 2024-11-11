"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx"; // For conditional class names
import Image from "next/image";

// Define the type for each navigation item
interface NavItem {
  name: string;
  href: string;
  icon: string;
}

// Navigation items array
const navItems: NavItem[] = [
  { name: "Home", href: "/home", icon: "/icon/home.svg" },
  { name: "List of Barangays", href: "/barangay", icon: "/icon/list.svg" },
  { name: "Documentation", href: "/documentation", icon: "/icon/doc.svg" },
  { name: "Donors", href: "/donor", icon: "/icon/donor.svg" },
  { name: "Profile", href: "/profile", icon: "/icon/profile.svg" },
];

const Nav: React.FC = () => {
  const pathname = usePathname(); // Get the current pathname

  return (
    <div className="bg-gray-800">
      <nav className="flex flex-col h-full justify-between text-white p-1 pt-2 pr-2 w-[220px]">
        <ul className="space-y-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <li key={item.name}>
                <Link href={item.href} passHref>
                  <button
                    className={clsx(
                      "flex mt-4 gap-2 px-4 py-2 rounded-lg items-center w-full transition-colors duration-200 whitespace-nowrap",
                      {
                        "bg-gray-700": isActive,
                        "hover:bg-gray-600": !isActive,
                      }
                    )}
                  >
                    <Image
                      src={item.icon}
                      alt=""
                      width={30}
                      height={30}
                      className=""
                    />
                    {item.name}
                  </button>
                </Link>
              </li>
            );
          })}
        </ul>
        <span className="w-full border border-b opacity-10  "></span>
        <div className="flex flex-col gap-4 justify-center items-center">
          <Image
            src={"/icon/scan-white.svg"}
            alt=""
            width={100}
            height={100}
            className="opacity-70 hover:opacity-100 hover:cursor-pointer"
          />
          <h1 className="opacity-70  text-center uppercase">
            Click here to Verify Beneficiary
          </h1>
        </div>
        <span className="w-full border border-b opacity-10 "></span>
        <footer className="flex flex-col justify-between items-center w-full italic opacity-50 p-4 mb-20 ">
          <h1 className="text-center text-xs">
            Caritas 2024 <span className="">|</span> All Rights Reserved
          </h1>
        </footer>
      </nav>
    </div>
  );
};

export default Nav;
