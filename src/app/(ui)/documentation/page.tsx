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
} from "@/app/lib/api/documentation/data";
import { MainLayout } from "@/app/layouts/MainLayout";

interface Folder {
  id: string;
  name: string;
}

const Documentation: React.FC = () => {
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

  const handleDeleteFolder = async (name: string) => {
    await deleteFolder(name);
    setFolders(folders.filter((folder) => folder.name !== name));
  };

  const handleFolderClick = (folderId: string) => {
    // Redirect to the sub-nested folder for media files
    router.push(`/documentation/${folderId}/media`);
  };

  const filteredFolders = folders.filter((folder) =>
    folder.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout>
      <Header />
      <div className="flex flex-row flex-1 bg-gray-700 ">
        <LeftNav />
        <div className="w-full overflow-y-auto p-4 h-svh pb-24">
          <div className="p-4 w-full bg-gray-700 ">
            <h2 className="p-8 text-3xl font-bold mb-4 text-center text-white">
              Documentation
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
              <div className="mb-4 flex gap-4 w-full">
                <button
                  className="bg-blue-500 text-white py-2 px-4 rounded-lg whitespace-nowrap"
                  onClick={handleAddFolder}
                >
                  <span className="font-extrabold text-xl">＋</span> Folder
                </button>
                <input
                  type="text"
                  placeholder="Folder name..."
                  className="w-full text-gray-700 bg-gray-100 p-2 border rounded-lg shadow-inner"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                />
              </div>
              <div className="flex mb-4 w-full">
                <input
                  type="text"
                  placeholder="Search for folder..."
                  className="w-full text-gray-700 bg-gray-100 p-2 border rounded-lg shadow-inner"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <h1 className="mt-2">Folders:</h1>
            <div className="grid mt-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredFolders.map((folder) => (
                <Folder
                  key={folder.id}
                  name={folder.name}
                  onDelete={() => handleDeleteFolder(folder.name)}
                  onClick={() => handleFolderClick(folder.name)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Documentation;
