"use client";

import React, { useState } from "react";
import Folder from "@/app/components/Barangay";
import Header from "@/app/components/Header";
import LeftNav from "@/app/components/Nav";

interface Folder {
  id: number;
  name: string;
}

const BarangayList: React.FC = () => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [newFolderName, setNewFolderName] = useState<string>("");

  const handleAddFolder = () => {
    if (newFolderName.trim() === "") return;

    const newFolder: Folder = {
      id: folders.length + 1,
      name: newFolderName,
    };

    setFolders([...folders, newFolder]);
    setNewFolderName(""); // Clear the input after adding
  };

  const handleDeleteFolder = (id: number) => {
    setFolders(folders.filter((folder) => folder.id !== id));
  };

  const filteredFolders = folders.filter((folder) =>
    folder.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-screen">
      <Header />
      <div className="flex flex-row flex-1 bg-gray-100">
        <LeftNav />
        <div className="p-4 w-full bg-gray-700 shadow-md ">
          <h2 className="p-8 text-3xl font-bold mb-4 text-center">
            List of Barangays
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
            <div className="mb-4 flex gap-4 w-full">
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded-lg whitespace-nowrap"
                onClick={handleAddFolder}
              >
                Add Barangay
              </button>
              <input
                type="text"
                placeholder="Barangay name..."
                className="w-full text-gray-700 p-2 border rounded-lg "
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
              />
            </div>
            <div className="flex mb-4 w-full">
              <input
                type="text"
                placeholder="Search for Barangay..."
                className="w-full text-gray-700 p-2 border rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredFolders.map((folder) => (
              <Folder
                key={folder.id}
                name={folder.name}
                onDelete={() => handleDeleteFolder(folder.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarangayList;