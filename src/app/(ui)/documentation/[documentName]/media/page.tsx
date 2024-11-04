"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useDropzone } from "react-dropzone";
import Resizer from "react-image-file-resizer";
import {
  addMediaFiles,
  fetchMediaFiles,
  deleteMediaFile,
} from "@/app/lib/api/document/data";
import Swal from "sweetalert2";
import Image from "next/image";

// Skeleton Loader Component
const SkeletonLoader: React.FC = () => (
  <div className="animate-pulse flex flex-col space-y-4 p-4 bg-gray-600 rounded-lg">
    <div className="bg-gray-500 h-40 rounded-md"></div>
    <div className="h-4 bg-gray-500 rounded"></div>
    <div className="h-4 bg-gray-500 rounded w-3/4"></div>
  </div>
);

interface Params {
  documentName: string;
}

interface MediaData {
  url: string; // URL for fetched media
  name: string;
  type: string;
}

const Media: React.FC = () => {
  const router = useRouter();
  const params = useParams() as unknown as Params;
  const { documentName } = params;

  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [fetchedMedia, setFetchedMedia] = useState<MediaData[]>([]);
  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  const [loadingFetchedMedia, setLoadingFetchedMedia] = useState<boolean>(true);
  const [viewingOption, setViewingOption] = useState<string>("Medium");
  const [selectedFileIndex, setSelectedFileIndex] = useState<number | null>(
    null
  );

  // Fetch media data on component mount
  useEffect(() => {
    const loadMediaData = async () => {
      setLoadingFetchedMedia(true);
      const fetchedData = await fetchMediaFiles(documentName);
      setFetchedMedia(fetchedData);
      setLoadingFetchedMedia(false);
    };

    loadMediaData();
  }, [documentName]);

  const onDrop = async (acceptedFiles: File[]) => {
    const compressedFiles: File[] = [];

    setIsCompressing(true);
    for (const file of acceptedFiles) {
      if (file.type.startsWith("image/")) {
        const compressedImage = await compressImage(file);
        compressedFiles.push(compressedImage);
      } else {
        compressedFiles.push(file);
      }
    }
    setIsCompressing(false);

    setMediaFiles((prev) => [...prev, ...compressedFiles]);

    // Upload the media files to Firebase Storage
    await addMediaFiles(documentName, compressedFiles);
  };

  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        800,
        800,
        "JPEG",
        70,
        0,
        (uri) => {
          resolve(uri as File);
        },
        "file"
      );
    });
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
      "video/*": [],
      "application/pdf": [],
      "application/msword": [],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [],
    },
  });

  const handleDeleteMedia = async (
    index: number,
    isFetched: boolean,
    fileName: string
  ) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete the media file "${fileName}"? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteMediaFile(documentName, fileName);
        if (isFetched) {
          setFetchedMedia((prev) => prev.filter((_, i) => i !== index));
        } else {
          setMediaFiles((prev) => prev.filter((_, i) => i !== index));
        }

        Swal.fire(
          "Deleted!",
          `The media file "${fileName}" has been deleted.`,
          "success"
        );
      } catch (error) {
        Swal.fire(
          "Error!",
          "Failed to delete the media file. Please try again.",
          "error"
        );
        console.error("Error deleting media file:", error);
      }
    }
  };

  const handleViewingOptionChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setViewingOption(event.target.value);
  };

  const getGridColumns = () => {
    switch (viewingOption) {
      case "Large":
        return "grid-cols-3";
      case "Medium":
        return "grid-cols-6";
      case "Small":
        return "grid-cols-12";
      default:
        return "grid-cols-6";
    }
  };

  const getCharLimit = () => {
    switch (viewingOption) {
      case "Large":
        return 25;
      case "Medium":
        return 15;
      case "Small":
        return 10;
      default:
        return 10;
    }
  };

  return (
    <div className="p-20 bg-gray-700 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded-lg"
          onClick={() => router.back()}
        >
          Back
        </button>
        <div className="flex gap-4">
          <select
            value={viewingOption}
            onChange={handleViewingOptionChange}
            className="bg-gray-600 text-white py-2 px-4 rounded-lg"
          >
            <option value="Large">Large</option>
            <option value="Medium">Medium</option>
            <option value="Small">Small</option>
          </select>
        </div>
      </div>
      <h2 className="text-2xl font-bold mb-4">
        {documentName.toUpperCase()} _ Media Files
      </h2>

      <div
        {...getRootProps()}
        className="border-dashed border-2 border-gray-400 p-10 text-center mb-4 cursor-pointer"
      >
        <input {...getInputProps()} />
        {isCompressing ? (
          <p>Compressing files, please wait...</p>
        ) : (
          <p>Drag & drop some files here, or click to select files</p>
        )}
      </div>

      <div className={`grid ${getGridColumns()} relative gap-4`}>
        {isCompressing || loadingFetchedMedia ? (
          Array.from({ length: 6 }).map((_, index) => (
            <SkeletonLoader key={index} />
          ))
        ) : (
          <>
            {mediaFiles.map((file, index) => (
              <div
                key={`local-${index}`}
                className="relative bg-gray-600 p-2 rounded-lg  overflow-hidden"
              >
                <div className="absolute top-2 right-2 z-10">
                  <button
                    className="text-white p-2 rounded-full w-10 z-12"
                    onClick={() =>
                      setSelectedFileIndex(
                        selectedFileIndex === index ? null : index
                      )
                    }
                  >
                    ⋮
                  </button>
                  {selectedFileIndex === index && (
                    <div className="absolute right-0 mt-2 bg-gray-700 rounded-lg shadow-lg z-20">
                      <button
                        className="block text-white px-4 py-2 hover:bg-red-600"
                        onClick={() =>
                          handleDeleteMedia(index, false, file.name)
                        }
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>

                {file.type && file.type.startsWith("image/") && (
                  <Image
                    src={URL.createObjectURL(file)}
                    alt="Image Preview"
                    width={400}
                    height={400}
                    className="w-full h-fill object-fit"
                  />
                )}
                {file.type && file.type.startsWith("video/") && (
                  <video
                    controls
                    src={URL.createObjectURL(file)}
                    className="w-full h-fill object-fit"
                  />
                )}
                {!file.type?.startsWith("image/") &&
                  !file.type?.startsWith("video/") && (
                    <p className="text-white text-wrap overflow-clip">
                      {file.name.length > getCharLimit()
                        ? `${file.name.substring(0, getCharLimit())}...`
                        : file.name}
                    </p>
                  )}
                {!(file.type && file.type.startsWith("application/")) && (
                  <p className="text-white text-wrap overflow-clip">
                    {file.name}
                  </p>
                )}
              </div>
            ))}
            {fetchedMedia.map((media, index) => (
              <div
                key={`fetched-${index}`}
                className="relative bg-gray-600 p-2 rounded-lg  overflow-hidden"
              >
                <div className="absolute top-2 right-2 z-10">
                  <button
                    className="text-white p-2 rounded-full w-10 z-12"
                    onClick={() =>
                      setSelectedFileIndex(
                        selectedFileIndex === index ? null : index
                      )
                    }
                  >
                    ⋮
                  </button>
                  {selectedFileIndex === index && (
                    <div className="absolute right-0 mt-2 bg-gray-700 rounded-lg shadow-lg z-20">
                      <button
                        className="block text-white px-4 py-2 hover:bg-red-600"
                        onClick={() =>
                          handleDeleteMedia(index, true, media.name)
                        }
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>

                {media.type && media.type.startsWith("image/") && (
                  <Image
                    src={media.url}
                    alt="Image Preview"
                    width={400}
                    height={400}
                    className="w-full h-fill object-cover"
                  />
                )}
                {media.type && media.type.startsWith("video/") && (
                  <video
                    controls
                    src={media.url}
                    className="w-full h-fill object-fit"
                  />
                )}
                {!media.type?.startsWith("image/") &&
                  !media.type?.startsWith("video/") && (
                    <p className="text-white text-wrap overflow-clip">
                      {media.name.length > getCharLimit()
                        ? `${media.name.substring(0, getCharLimit())}...`
                        : media.name}
                    </p>
                  )}
                {!(media.type && media.type.startsWith("application/")) && (
                  <p className="text-white text-wrap overflow-clip">
                    {media.name.length > getCharLimit()
                      ? `${media.name.substring(0, getCharLimit())}...`
                      : media.name}
                  </p>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Media;
