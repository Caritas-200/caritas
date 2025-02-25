"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx"; // For conditional class names
import Image from "next/image";
import { VerifyBeneficiary } from "./qr/subComponent/verifyBeneficiary";

// Define the type for each navigation item
interface NavItem {
  name: string;
  href: string;
  icon: string;
}

// Navigation items array
const navItems: NavItem[] = [
  { name: "Home", href: "/home", icon: "/icon/home.svg" },
  { name: "Barangay", href: "/barangay", icon: "/icon/list.svg" },
  { name: "Calamity", href: "/calamity", icon: "/icon/calamity.svg" },
  { name: "Donor", href: "/donor", icon: "/icon/donor.svg" },
  { name: "Document", href: "/documentation", icon: "/icon/doc.svg" },
  { name: "Profile", href: "/profile", icon: "/icon/profile.svg" },
];

const Nav: React.FC = () => {
  const pathname = usePathname(); // Get the current pathname
  const [showModal, setShowModal] = useState(false);

  const handleModal = () => {
    setShowModal((prev) => !prev);
  };
  return (
    <>
      <div className="bg-bg-color text-text-color">
        <nav className="flex flex-col h-full justify-between p-1 pt-2 pr-2 w-[220px]">
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
                          "bg-white shadow-sm border font-bold": isActive,
                          "hover:bg-white": !isActive,
                        }
                      )}
                    >
                      <Image
                        src={item.icon}
                        alt=""
                        width={40}
                        height={40}
                        className="bg-white p-2 rounded-full shadow-sm"
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
            <button onClick={handleModal} className="">
              <Image
                src={"/icon/scan.svg"}
                alt=""
                width={100}
                height={100}
                className="opacity-80 hover:opacity-100 hover:cursor-pointer hover:scale-105 bg-white p-2 rounded-md shadow-sm border-1"
              />
            </button>
            <h1 className="opacity-70  text-center uppercase ">
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

      {showModal && <VerifyBeneficiary onClose={handleModal} />}
    </>
  );
};

export default Nav;
