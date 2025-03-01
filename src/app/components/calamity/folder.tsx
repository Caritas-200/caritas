"use client";

import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useRouter } from "next/navigation";

interface FolderProps {
  name: string;
  calamityType: string;
  onDelete: () => void;
}

const MySwal = withReactContent(Swal);

const Folder: React.FC<FolderProps> = ({ name, onDelete, calamityType }) => {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleDelete = () => {
    MySwal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        onDelete();
        MySwal.fire("Deleted!", "Your folder has been deleted.", "success");
      }
    });
  };

  const handleNavigate = (name: string, calamityType: string) => {
    const data = { name, calamityType };
    sessionStorage.setItem("calamityData", JSON.stringify(data));

    // Navigate to the next page
    router.push(`/calamity/${name}/beneficiary`);
  };

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
      setShowMenu(false);
    }
  };

  useEffect(() => {
    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  return (
    <div
      className="relative hover:bg-blue-500 hover:text-white bg-white-primary p-4 rounded-lg shadow-sm cursor-pointer"
      onClick={() => handleNavigate(name, calamityType)}
    >
      <h3 className="text-lg font-semibold">{name.toUpperCase()}</h3>
      <button
        onClick={toggleMenu}
        className="absolute top-0 -mt-2 right-2 text-gray-400 text-2xl hover:text-gray-100"
      >
        ...
      </button>
      {showMenu && (
        <div
          ref={menuRef}
          className="absolute top-8 right-2 bg-white text-gray-700 rounded-lg shadow-lg z-10 overflow-hidden"
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
            className="block px-4 py-2 text-left w-full "
          >
            <h1 className="text-red-500 text-bold"> ✖</h1>
          </button>
        </div>
      )}
    </div>
  );
};

export default Folder;
