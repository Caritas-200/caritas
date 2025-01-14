import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import { FamilyMember } from "@/app/lib/definitions";
import {
  addBeneficiary,
  updateBeneficiaryWithQrCode,
  updateBeneficiary,
} from "@/app/lib/api/beneficiary/data";
import { familyInfoFields } from "@/app/config/formConfig";
import { validateFamilyForm } from "@/app/util/validateFamilyForm";
import { removeFamilyMember } from "@/app/util/removeFamilyRow";
import { generateQrImage } from "@/app/util/generateQRImage";
import QRCode from "react-qr-code";
import BeneficiaryIdQr from "./BeneficiaryIdQr";
import ProgressBar from "../../ProgressBar";
import { hideLoading } from "../../loading";

interface FamilyModalProps {
  onClose: () => void;
  onBack: () => void;
  formData: any;
  brgyName: string;
  isEditing?: boolean;
}

const FamilyListModal: React.FC<FamilyModalProps> = ({
  onClose,
  onBack,
  formData,
  brgyName,
  isEditing,
}) => {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([
    {
      name: "",
      relation: "",
      age: "",
      gender: "",
      civilStatus: "",
      education: "",
      skills: "",
      remarks: "",
    },
  ]);

  const [isValid, setIsValid] = useState(true);
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrData, setQrData] = useState("");
  const qrCodeRef = useRef<HTMLDivElement>(null);
  const [printData, setPrintData] = useState("");

  useEffect(() => {
    // Load the formData and set familyMembers if available
    if (formData && formData.familyMembers) {
      setFamilyMembers(formData.familyMembers);
    }
  }, [formData]);

  const handleChange = (
    index: number,
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    const updatedMembers = familyMembers.map((member, i) =>
      i === index ? { ...member, [name]: value } : member
    );
    setFamilyMembers(updatedMembers);
    validateFamilyForm(updatedMembers, setIsValid);
  };

  const addFamilyMember = () => {
    setFamilyMembers([
      ...familyMembers,
      {
        name: "",
        relation: "",
        age: "",
        gender: "",
        civilStatus: "",
        education: "",
        skills: "",
        remarks: "",
      },
    ]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const hasAnyData = familyMembers.some(
      (member) =>
        member.name.trim() !== "" ||
        member.relation !== "" ||
        member.age !== "" ||
        member.gender !== "" ||
        member.civilStatus !== ""
    );

    if (!hasAnyData) {
      Swal.fire({
        title: "No Family Members Added",
        text: "The beneficiary will be considered living alone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, proceed",
        cancelButtonText: "No, go back",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await saveBeneficiary(false); // Indicate no family data
        }
      });
    } else {
      await saveBeneficiary(true); // Indicate there is family data
    }
  };

  const saveBeneficiary = async (includeFamilyMembers: boolean) => {
    Swal.fire({
      title: "Saving...",
      text: "Please wait while we save the beneficiary data.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const beneficiaryData = { ...formData };

      // Always include familyMembers key but leave it as an empty array if no data is added
      beneficiaryData.familyMembers = includeFamilyMembers ? familyMembers : [];

      setPrintData(JSON.stringify(beneficiaryData));

      if (isEditing) {
        // Update logic
        const result = await updateBeneficiary(
          beneficiaryData.id,
          beneficiaryData,
          brgyName
        );

        if (!result)
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: "Beneficiary updated successfully.",
          }).then(() => {
            hideLoading();
          });
        else {
          Swal.fire({
            icon: "error",
            title: "Error!",
            text: "Beneficiary update failed.",
          }).then(() => {
            hideLoading();
          });
        }
      } else {
        // Add new beneficiary
        const newBeneficiaryId = await addBeneficiary(
          beneficiaryData,
          brgyName
        );

        // Generate QR payload
        const generateQrPayload = JSON.stringify({
          id: newBeneficiaryId,
          lastName: beneficiaryData.lastName,
          brgyName,
        });

        setQrData(generateQrPayload); // Update QR data

        // Wait for QR code to be rendered
        await new Promise((resolve) => setTimeout(resolve, 500));

        const qrImage = await generateQrImage(qrCodeRef);
        await updateBeneficiaryWithQrCode(newBeneficiaryId, qrImage, brgyName);

        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Beneficiary added successfully.",
        }).then(() => {
          setShowQRModal(true); // Show modal
        });
      }
    } catch (error: unknown) {
      Swal.close();
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error instanceof Error ? error.message : "An unknown error occurred.",
      });
    }
  };

  return (
    <div className="fixed p-6 inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-screen-lg max-h-[95%] relative overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-700"
        >
          ✖
        </button>
        <h2 className="text-2xl font-bold mb-4 pb-4 text-center text-gray-900">
          {`${
            !isEditing ? "Add Family Members " : "Edit Family Member Details"
          }`}
        </h2>

        <ProgressBar currentStep={3} />
        <form onSubmit={handleSubmit}>
          {familyMembers.map((member, index) => (
            <div
              key={index}
              className="grid grid-cols-8 gap-4 mb-4 border-b-2 pb-2"
            >
              {familyInfoFields.map(({ label, name, placeholder, options }) => (
                <div key={name} className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {label}
                  </label>
                  {options ? (
                    <select
                      name={name}
                      value={(member as any)[name]}
                      onChange={(e) => handleChange(index, e)}
                      className="w-full p-2 border rounded text-gray-700"
                    >
                      <option value="">Select {label.toLowerCase()}</option>
                      {options.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      name={name}
                      value={(member as any)[name]}
                      onChange={(e) => handleChange(index, e)}
                      className="w-full p-2 border rounded text-gray-700"
                      placeholder={placeholder}
                      type={name === "age" ? "number" : "text"}
                      min={name === "age" ? 10 : undefined}
                      max={name === "age" ? 100 : undefined}
                    />
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  removeFamilyMember(
                    index,
                    familyMembers,
                    setFamilyMembers,
                    setIsValid
                  )
                }
                className="col-span-1 bg-red-500 text-white px-4 py-2 rounded-lg"
              >
                ✖
              </button>
            </div>
          ))}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={addFamilyMember}
              className="bg-green-500 text-white px-4 py-2 rounded-lg"
            >
              + New Row
            </button>
            <div className="flex">
              <button
                type="button"
                onClick={onBack}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg mr-2"
              >
                Back
              </button>
              <button
                type="submit"
                className={`bg-blue-500 text-white px-4 py-2 rounded-lg ${
                  !isValid ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={!isValid}
              >
                {`${!isEditing ? "Add Beneficiary" : " Update Beneficiary"}`}
              </button>
            </div>
          </div>
        </form>

        {/* Hidden QR Code */}

        <div className="flex-none">
          {qrData && (
            <div ref={qrCodeRef}>
              <QRCode value={qrData} size={150} />
            </div>
          )}
        </div>
      </div>

      {/* QR Code Modal */}
      {showQRModal && (
        <BeneficiaryIdQr
          beneficiaryData={printData}
          qrData={qrData}
          onClose={onClose}
          from="barangay"
        />
      )}
    </div>
  );
};

export default FamilyListModal;
