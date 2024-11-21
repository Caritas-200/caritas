import React, { useState } from "react";
import { UserData } from "@/app/lib/definitions";
import { toSentenceCase } from "@/app/util/toSentenceCase";
import Webcam from "react-webcam";
import Image from "next/image";
import { updateVerifiedBeneficiary } from "@/app/lib/api/beneficiary/data";
import Swal from "sweetalert2";

interface DecodedData {
  id: string;
  brgyName: string;
}

interface ModalProps {
  data: UserData;
  onClose: () => void;
  decodedData: DecodedData;
}

const UserFormModal: React.FC<ModalProps> = ({
  data,
  onClose,
  decodedData,
}) => {
  const [formData] = useState<UserData>(data);
  const [benefitForm, setBenefitForm] = useState<{
    donationType: string;
    quantity: string;
    cost: string;
  }>({
    donationType: "",
    quantity: "",
    cost: "",
  });
  const [customCost, setCustomCost] = useState<string>("");
  const [isCustomCost, setIsCustomCost] = useState<boolean>(false);
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const webcamRef = React.useRef<Webcam>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;

    if (name === "cost") {
      const isCustom = value === "custom";
      setIsCustomCost(isCustom);
      setBenefitForm((prev) => ({ ...prev, cost: isCustom ? "" : value }));
    } else {
      setBenefitForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCustomCostChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { value } = e.target;
    setCustomCost(value);
    setBenefitForm((prev) => ({ ...prev, cost: value }));
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    // Check if required fields are filled
    if (!benefitForm || !capturedImage) {
      // Display a notification if any required field is missing
      Swal.fire({
        title: "Missing Required Fields",
        text: "Please fill out all required fields (Donation Type, Monetary Value) and ensure an image is captured before submitting.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return; // Prevent form submission
    }

    const newStatus = "claimed";

    try {
      let imageFile: File | null = null;

      if (capturedImage) {
        // Convert base64 string to a File object if needed
        const byteString = atob(capturedImage.split(",")[1]);
        const mimeType =
          capturedImage.split(",")[0].match(/:(.*?);/)?.[1] || "image/png";
        const byteArray = new Uint8Array(byteString.length);
        for (let i = 0; i < byteString.length; i++) {
          byteArray[i] = byteString.charCodeAt(i);
        }
        imageFile = new File([byteArray], "captured-image.png", {
          type: mimeType,
        });
      }

      // Perform the update
      const result = await updateVerifiedBeneficiary(
        decodedData.id,
        benefitForm,
        decodedData.brgyName,
        newStatus,
        imageFile
      );

      if (result.success) {
        // Show success notification
        Swal.fire({
          title: "Success",
          text: "Benefits successfully released!",
          icon: "success",
          confirmButtonText: "OK",
        });
      } else
        Swal.fire({
          title: "Error",
          text: result.message,
          icon: "error",
          confirmButtonText: "OK",
        });
    } catch (error) {
      console.error("Error updating beneficiary:", error);

      // Show error notification
      Swal.fire({
        title: "Error",
        text: "An error occurred while updating the beneficiary. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      // Close modal or perform any final cleanup
      onClose();
    }
  };

  const fields = [
    { label: "Calamity Name", value: formData.calamityName },
    { label: "Calamity Type", value: formData.calamityType },
    {
      label: "Date Created",
      value: new Date(formData.dateCreated.seconds * 1000).toLocaleString(),
    },
  ];

  const renderInputField = (
    label: string,
    id: string,
    value: string,
    onChange: (e: React.ChangeEvent<any>) => void,
    type = "text"
  ) => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
      </label>
      <input
        type={type}
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        className="mt-1 block w-full p-2 border rounded"
      />
    </div>
  );

  const handleCapture = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setCapturedImage(imageSrc);
      setIsCameraOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 ">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl max-h-[90%] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 border-b-2 pb-2 font-semibold">
          <h1 className="uppercase text-xl">
            {formData.firstName} {formData.middleName} {formData.lastName}
          </h1>
          <button
            onClick={onClose}
            className="text-gray-600 text-2xl hover:text-red-500"
          >
            &times;
          </button>
        </div>

        {/* Display form data */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          {fields.map(({ label, value }) => (
            <div key={label}>
              <span className="block text-sm font-medium">{label}</span>
              <p className="mt-1 p-2 border rounded bg-gray-100">{value}</p>
            </div>
          ))}
        </div>
        <div className="border-b-2 mb-4">
          <label
            htmlFor="donationType"
            className="block text-sm font-medium pb-2"
          >
            List of Family Members
          </label>
          <ol className="list-decimal list-inside mb-2 p-2 border rounded bg-gray-100">
            {formData.familyMembers.map(({ name, relation }, index) => (
              <li key={index}>
                {toSentenceCase(name) +
                  " (" +
                  toSentenceCase(relation === "Children" ? "child" : relation) +
                  ")"}
              </li>
            ))}
          </ol>
        </div>

        {/* Benefit Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="donationType" className="block text-sm font-medium">
              Type of Benefits
            </label>
            <select
              id="donationType"
              name="donationType"
              value={benefitForm.donationType}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border rounded"
              required
            >
              <option value="">Select</option>
              {[
                "Monetary Donations",
                "Food and Water",
                "Clothing",
                "Medical Supplies",
                "Hygiene Kits",
                "Shelter Materials",
                "Volunteering Services",
                "Educational Supplies",
                "Pet Supplies",
                "Transportation Assistance",
              ].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {renderInputField(
            "Quantity (Optional)",
            "quantity",
            benefitForm.quantity,
            handleChange
          )}

          <div>
            <label htmlFor="cost" className="block text-sm font-medium">
              Monetary Value
            </label>
            <select
              id="cost"
              name="cost"
              value={benefitForm.cost}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border rounded mb-2"
            >
              <option value="">Select a range</option>
              <option value="1001-5000">1,001 - 5,000</option>
              <option value="5001-10000">5,001 - 10,000</option>
              <option value="10001-15000">10,001 - 15,000</option>
              <option value="15001-20000">15,001 - 20,000</option>
              <option value="custom">Custom</option>
            </select>
            {isCustomCost &&
              renderInputField(
                "Enter Custom Value",
                "customCost",
                customCost,
                handleCustomCostChange,
                "number"
              )}
          </div>

          {/* Button to open the camera modal */}
          <div>
            <label htmlFor="cost" className="block text-sm font-medium mb-2">
              Claimants picture with valid ID
            </label>
            <button
              type="button"
              onClick={() => setIsCameraOpen(true)}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Capture
            </button>
          </div>

          {capturedImage && (
            <div className="mt-4">
              <Image
                src={capturedImage!}
                alt="Captured"
                className="mt-2 w-1/4 h-auto rounded"
                width={40}
                height={20}
              />
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Submit & Release
            </button>
          </div>
        </form>
      </div>

      {/* Camera Modal */}
      {isCameraOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-xl font-semibold">Capture Image</h1>
              <button
                onClick={() => setIsCameraOpen(false)}
                className="text-gray-600 text-2xl hover:text-red-500"
              >
                &times;
              </button>
            </div>
            <Webcam
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width="100%"
            />
            <div className="mt-4 flex justify-center space-x-2">
              <button
                onClick={handleCapture}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Capture
              </button>
              <button
                onClick={() => setIsCameraOpen(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserFormModal;
