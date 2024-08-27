"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx"; // For conditional class names

// Define the type for each navigation item
interface NavItem {
  name: string;
  href: string;
}

const navItems: NavItem[] = [
  { name: "Home", href: "/home" },
  { name: "List of Barangays", href: "/barangays" },
  { name: "Documentation", href: "/documentation" },
  { name: "Donors", href: "/donors" },
];

const Nav: React.FC = () => {
  const pathname = usePathname(); // Get the current pathname

  return (
    <nav className="bg-gray-800 text-white h-screen p-4">
      <ul className="space-y-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <li key={item.name}>
              <Link href={item.href}>
                <button
                  className={clsx(
                    "block px-4 py-2 rounded-lg transition-colors duration-200",
                    {
                      "bg-gray-700": isActive,
                      "hover:bg-gray-600": !isActive,
                    }
                  )}
                >
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
