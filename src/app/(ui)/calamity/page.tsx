"use client";

import React, { useState, useEffect } from "react";
import Folder from "@/app/components/calamity/folder";
import { showLoading, hideLoading } from "@/app/components/loading";
import {
  addCalamity,
  deleteCalamity,
  getAllCalamity,
} from "@/app/lib/api/calamity/data";
import { MainLayout } from "@/app/layouts/MainLayout";
import { calamityTypes } from "@/app/config/calamity";

interface Folder {
  id: string;
  calamityType: string;
  name: string;
}

const Calamity: React.FC = () => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isAddingFolder, setIsAddingFolder] = useState<boolean>(false);
  const [newFolderName, setNewFolderName] = useState<string>("");
  const [newCalamityType, setNewCalamityType] = useState<string>("");
  const [selectedCalamityType, setSelectedCalamityType] = useState<string>("");

  // Handle adding new calamity folder
  const handleAddFolder = async () => {
    if (newFolderName.trim() === "" || newCalamityType === "") return;

    const newFolder: Folder = {
      id: (folders.length + 1).toString(),
      name: newFolderName,
      calamityType: newCalamityType,
    };

    // Add calamity here to db
    await addCalamity(newFolder.name, {
      name: newFolder.name,
      calamityType: newFolder.calamityType,
    });

    setFolders([...folders, newFolder]);
    setNewFolderName("");
    setNewCalamityType("");
    setIsAddingFolder(false);
  };

  const handleDeleteFolder = async (id: string) => {
    await deleteCalamity(id);
    setFolders(folders.filter((folder) => folder.id !== id));
  };

  const filteredFolders = folders.filter((folder) => {
    const matchesSearchTerm = folder.name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCalamityType =
      selectedCalamityType === "" ||
      folder.calamityType === selectedCalamityType;
    return matchesSearchTerm && matchesCalamityType;
  });

  const groupedFolders = filteredFolders.reduce((acc, folder) => {
    const firstLetter = folder.name[0].toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(folder);
    return acc;
  }, {} as Record<string, typeof filteredFolders>);

  const sortedKeys = Object.keys(groupedFolders).sort();

  // Fetch Calamity stored in db
  useEffect(() => {
    const fetchCalamity = async () => {
      showLoading();
      const calamity = await getAllCalamity();
      setFolders(calamity);
      hideLoading();
    };

    fetchCalamity();
  }, []);

  return (
    <MainLayout>
      <div className="p-4 w-full bg-bg-color text-text-color">
        <h2 className="p-8 text-3xl font-bold mb-4 text-center">
          List of Calamity
        </h2>
        <div className="flex flex-row whitespace-nowrap gap-4 border-b border-gray-200">
          <div className="mb-4 flex gap-4 w-full justify-between">
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded-lg whitespace-nowrap"
              onClick={() => setIsAddingFolder(true)}
            >
              <span className="font-extrabold text-xl">＋</span> Calamity
            </button>

            <div className="flex gap-4 w-full justify-between">
              <input
                type="text"
                placeholder="Search for Calamity..."
                className="w-1/2 text-gray-700  p-2 border rounded-lg shadow-inner outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select
                className="p-2 border rounded-lg text-gray-700"
                value={selectedCalamityType}
                onChange={(e) => setSelectedCalamityType(e.target.value)}
              >
                <option value="">All Calamity</option>
                {calamityTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {isAddingFolder && (
          <div className="mb-4 pb-4 border-b border-gray-500 mt-2">
            <h3 className="text-xl font-bold mb-4">New Calamity Folder</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="mb-4">
                <label className="block mb-2">Calamity Type</label>
                <select
                  className="w-full p-2 bg-gray-100 border rounded-lg text-gray-500"
                  value={newCalamityType}
                  onChange={(e) => setNewCalamityType(e.target.value)}
                >
                  <option value="">Select Calamity Type</option>
                  {calamityTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block mb-2 outline-none">Calamity Name</label>
                <input
                  type="text"
                  className="w-full p-2 bg-gray-100 border rounded-lg text-gray-500 outline-none"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Calamity name..."
                />
              </div>
            </div>

            <button
              className="bg-green-600 text-white px-4 py-2 rounded-lg mr-2 hover:bg-green-700"
              onClick={handleAddFolder}
            >
              Submit
            </button>
            <button
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              onClick={() => setIsAddingFolder(false)}
            >
              Cancel
            </button>
          </div>
        )}

        <div className="flex flex-col gap-4 gap-y-4 mt-4">
          {sortedKeys.map((letter) => (
            <div key={letter}>
              <h1 className="mb-4 text-xl">{letter}</h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                {groupedFolders[letter].map((folder) => (
                  <Folder
                    key={folder.id}
                    name={folder.name}
                    calamityType={folder.calamityType}
                    onDelete={() => handleDeleteFolder(folder.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Calamity;
