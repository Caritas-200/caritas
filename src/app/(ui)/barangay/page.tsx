"use client";

import React, { useState, useEffect } from "react";
import Folder from "@/app/components/barangay/Barangay";
import Header from "@/app/components/Header";
import LeftNav from "@/app/components/Nav";
import { showLoading, hideLoading } from "@/app/components/loading";
import {
  addBarangay,
  getAllBarangays,
  deleteBarangay,
} from "@/app/lib/api/barangay/data";
import { MainLayout } from "@/app/layouts/MainLayout";

interface Folder {
  id: string;
  name: string;
}

const BarangayList: React.FC = () => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [newFolderName, setNewFolderName] = useState<string>("");

  //fetch barangays stored in db
  useEffect(() => {
    const fetchBarangays = async () => {
      showLoading();
      const barangays = await getAllBarangays();
      setFolders(barangays);
      hideLoading();
    };

    fetchBarangays();
  }, []);

  //handle adding new barangay folder
  const handleAddFolder = async () => {
    if (newFolderName.trim() === "") return;

    const newFolder: Folder = {
      id: (folders.length + 1).toString(),
      name: newFolderName.toLowerCase(),
    };

    //add barangay here to db
    await addBarangay(newFolder.name, {
      name: newFolder.name,
    });

    setFolders([...folders, newFolder]);
    setNewFolderName(""); // Clear the input after adding
  };

  const handleDeleteFolder = async (id: string) => {
    await deleteBarangay(id);
    setFolders(folders.filter((folder) => folder.id !== id));
  };

  const filteredFolders = folders.filter((folder) =>
    folder.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedFolders = filteredFolders.reduce((acc, folder) => {
    const firstLetter = folder.name[0].toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(folder);
    return acc;
  }, {} as Record<string, typeof filteredFolders>);

  const sortedKeys = Object.keys(groupedFolders).sort();

  return (
    <MainLayout>
      <Header />
      <div className="flex flex-row flex-1 bg-gray-700 text-gray-100">
        <LeftNav />
        <div className="w-full overflow-y-auto p-4 h-svh pb-24">
          <div className="p-4 w-full bg-gray-700 ">
            <h2 className="p-8 text-3xl font-bold mb-4 text-center">
              List of Barangays
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 border-b border-gray-500 mb-4">
              <div className="mb-4 flex gap-4 w-full">
                <button
                  className="bg-blue-500 text-white py-2 px-4 rounded-lg whitespace-nowrap"
                  onClick={handleAddFolder}
                >
                  <span className="font-extrabold text-xl">＋</span> Barangay
                </button>
                <input
                  type="text"
                  placeholder="Barangay name..."
                  className="w-full text-gray-700 bg-gray-100 p-2 border rounded-lg shadow-inner "
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                />
              </div>
              <div className="flex mb-4 w-full">
                <input
                  type="text"
                  placeholder="Search for Barangay..."
                  className="w-full text-gray-700 bg-gray-100 p-2 border rounded-lg shadow-inner "
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-4 gap-y-4">
              {sortedKeys.map((letter) => (
                <div key={letter}>
                  <h1 className="mb-4 text-xl">{letter}</h1>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                    {groupedFolders[letter].map((folder) => (
                      <Folder
                        key={folder.id}
                        name={folder.name}
                        onDelete={() => handleDeleteFolder(folder.id)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default BarangayList;
