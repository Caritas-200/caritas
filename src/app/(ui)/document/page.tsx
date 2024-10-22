"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Folder from "@/app/components/documentation/Folder";
import Header from "@/app/components/Header";
import LeftNav from "@/app/components/Nav";
import { showLoading, hideLoading } from "@/app/components/loading";
import {
  addFolder,
  getAllFolders,
  deleteFolder,
} from "@/app/lib/api/documentation/data"; // Updated API methods for documentation

interface Folder {
  id: string;
  name: string;
}

const Document: React.FC = () => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [newFolderName, setNewFolderName] = useState<string>("");
  const router = useRouter();

  // Fetch folders stored in db
  useEffect(() => {
    const fetchFolders = async () => {
      showLoading();
      const fetchedFolders = await getAllFolders();
      setFolders(fetchedFolders);
      hideLoading();
    };

    fetchFolders();
  }, []);

  // Handle adding new folder
  const handleAddFolder = async () => {
    if (newFolderName.trim() === "") return;

    const newFolder: Folder = {
      id: (folders.length + 1).toString(),
      name: newFolderName.toLowerCase(),
    };

    // Add folder to db
    await addFolder(newFolder.name, {
      name: newFolder.name,
    });

    setFolders([...folders, newFolder]);
    setNewFolderName(""); // Clear the input after adding
  };

  const handleDeleteFolder = async (id: string) => {
    await deleteFolder(id);
    setFolders(folders.filter((folder) => folder.id !== id));
  };

  const handleFolderClick = (folderId: string) => {
    // Redirect to the sub-nested folder for media files
    router.push(`/documentation/${folderId}`);
  };

  const filteredFolders = folders.filter((folder) =>
    folder.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-screen">
      <Header />
      <div className="flex flex-row flex-1 bg-gray-700 ">
        <LeftNav />
        <div className="p-4 w-full bg-gray-700 shadow-md ">
          <h2 className="p-8 text-3xl font-bold mb-4 text-center text-white">
            Documentation
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
            <div className="mb-4 flex gap-4 w-full">
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded-lg whitespace-nowrap"
                onClick={handleAddFolder}
              >
                Add Folder
              </button>
              <input
                type="text"
                placeholder="Folder name..."
                className="w-full text-gray-700 p-2 border rounded-lg "
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
              />
            </div>
            <div className="flex mb-4 w-full">
              <input
                type="text"
                placeholder="Search for folder..."
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
                onClick={() => handleFolderClick(folder.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Document;
