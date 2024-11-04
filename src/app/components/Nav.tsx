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
    <nav className="bg-gray-800 text-white min-h-screen p-1 pt-2 pr-2 min-w-[220px]">
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
    </nav>
  );
};

export default Nav;
