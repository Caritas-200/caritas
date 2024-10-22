"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useDropzone } from "react-dropzone";
import Resizer from "react-image-file-resizer";
import JSZip from "jszip";
import FileSaver from "file-saver";
import { addMediaFiles } from "@/app/lib/api/document/data";

interface Params {
  documentName: string;
}

const Media: React.FC = () => {
  const router = useRouter();
  const params = useParams() as unknown as Params;
  const { documentName } = params;

  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  const [viewingOption, setViewingOption] = useState<string>("Medium");
  const [selectedFileIndex, setSelectedFileIndex] = useState<number | null>(
    null
  );

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

  const handleDeleteMedia = (index: number) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleViewingOptionChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setViewingOption(event.target.value);
  };

  const downloadAllFiles = async () => {
    if (mediaFiles.length === 0) {
      alert("No files to download");
      return;
    }

    const zip = new JSZip();
    mediaFiles.forEach((file) => {
      zip.file(file.name, file);
    });

    const content = await zip.generateAsync({ type: "blob" });
    FileSaver.saveAs(content, `${documentName}_files.zip`);
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
        return 10; // Fallback
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
          <button
            className="bg-green-500 text-white py-2 px-4 rounded-lg"
            onClick={downloadAllFiles}
          >
            Download All
          </button>
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
        {mediaFiles.map((file, index) => (
          <div
            key={index}
            className="relative bg-gray-600 p-4 rounded-lg h-fit"
          >
            {/* Positioning for dropdown button */}
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
                <div className="absolute right-0 mt-2 bg-gray-700 rounded-lg shadow-lg z-20 hover:z-25">
                  <button
                    className="block text-white px-4 py-2 hover:bg-red-600"
                    onClick={() => handleDeleteMedia(index)}
                  >
                    Delete
                  </button>
                  <button
                    className="block text-white px-4 py-2 hover:bg-gray-600"
                    onClick={() => {
                      const url = URL.createObjectURL(file);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = file.name;
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                    }}
                  >
                    Download
                  </button>
                </div>
              )}
            </div>

            {/* File preview for images */}
            {file.type.startsWith("image/") && (
              <img
                src={URL.createObjectURL(file)}
                alt="Image Preview"
                className="w-full h-auto"
              />
            )}

            {/* File preview for videos */}
            {file.type.startsWith("video/") && (
              <video
                controls
                src={URL.createObjectURL(file)}
                className="w-full h-auto"
              />
            )}

            {/* For document types, do not display name */}
            {!file.type.startsWith("image/") &&
              !file.type.startsWith("video/") && (
                <p className="text-white text-wrap overflow-clip">
                  {file.name.length > getCharLimit()
                    ? `${file.name.substring(0, getCharLimit())}...`
                    : file.name}
                </p>
              )}

            {/* Display name only for images and videos */}
            {(file.type.startsWith("image/") ||
              file.type.startsWith("video/")) && (
              <p className="text-white mt-2 overflow-clip">
                {file.name.length > getCharLimit()
                  ? `${file.name.substring(0, getCharLimit())}...`
                  : file.name}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Media;
