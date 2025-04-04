"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Folder from "@/app/components/documentation/Folder";
import { showLoading, hideLoading } from "@/app/components/loading";
import {
  addFolder,
  getAllFolders,
  deleteFolder,
} from "@/app/lib/api/documentation/data";
import { MainLayout } from "@/app/layouts/MainLayout";
import { formatFolderName } from "@/app/util/formatFolderName";
import {
  showSuccessNotification,
  showErrorNotification,
} from "@/app/util/notification";

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
    if (newFolderName.trim() === "") {
      showErrorNotification("Folder name cannot be empty.");
      return;
    }

    const formattedName = formatFolderName(newFolderName);

    const newFolder: Folder = {
      id: (folders.length + 1).toString(),
      name: formattedName,
    };

    try {
      // Add folder to db
      await addFolder(newFolder.name, {
        name: newFolder.name,
      });

      setFolders([...folders, newFolder]);
      setNewFolderName(""); // Clear the input after adding
      showSuccessNotification("Folder added successfully.");
    } catch (error) {
      showErrorNotification("Error adding folder. Please try again.");
    }
  };

  const handleDeleteFolder = async (name: string) => {
    try {
      await deleteFolder(name);
      setFolders(folders.filter((folder) => folder.name !== name));
      showSuccessNotification("Folder deleted successfully.");
    } catch (error) {
      showErrorNotification("Error deleting folder. Please try again.");
    }
  };

  const handleFolderClick = (folderId: string) => {
    // Redirect to the sub-nested folder for media files
    router.push(`/documentation/${folderId}/media`);
  };

  const filteredFolders = folders.filter(
    (folder) =>
      folder.name &&
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
      <div className="w-full overflow-y-auto p-4 pb-24 bg-bg-color text-text-color ">
        <h2 className="p-8 text-3xl font-bold mb-4 text-center ">
          Documentation
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4  border-b border-gray-200 mb-4">
          <div className="mb-4 flex w-full justify-between  text-gray-700 bg-gray-100 border overflow-hidden  rounded-lg shadow-inner">
            <input
              type="text"
              placeholder="Folder name..."
              className=" px-4 w-full outline-none"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
            />
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white-primary -m-[1px] py-2 px-4  whitespace-nowrap"
              onClick={handleAddFolder}
            >
              <span className="font-extrabold text-2xl">＋</span>
            </button>
          </div>
          <div className="flex mb-4 w-full">
            <input
              type="text"
              placeholder="Search for folder..."
              className="w-full text-gray-700  p-2 border rounded-lg shadow-inner outline-none"
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
                    onDelete={() => handleDeleteFolder(folder.name)}
                    onClick={() => handleFolderClick(folder.id)}
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

export default Documentation;
