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
      <div className="flex border-l border-opacity-50 flex-row flex-1 bg-bg-color">
        <div className="w-full overflow-y-auto p-4 h-svh pb-24">
          <div className="p-4 w-full  ">
            <h2 className="p-8 text-3xl font-bold mb-4 text-center">
              List of Barangays
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 border-b border-gray-200 mb-4">
              <div className="mb-4 flex w-full justify-between    border overflow-hidden  rounded-lg shadow-inner">
                <input
                  type="text"
                  placeholder="Barangay name..."
                  className=" px-4 w-full shadow-inner outline-none"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                />
                <button
                  className="bg-blue-500 hover:bg-blue-600  -m-[1px] py-2 px-4  whitespace-nowrap"
                  onClick={handleAddFolder}
                >
                  <span className="font-extrabold text-2xl text-white">＋</span>
                </button>
              </div>
              <div className="flex mb-4 w-full">
                <input
                  type="text"
                  placeholder="Search for Barangay..."
                  className="w-full   p-2 border rounded-lg shadow-inner outline-none "
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
