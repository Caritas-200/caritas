"use client";

import React, { useState, useEffect, useRef } from "react";
import { QrReader } from "react-qr-reader";
import Image from "next/image";
import { verifyRecipient } from "@/app/lib/api/beneficiary/data";
import clsx from "clsx";
import { showLoading, hideLoading } from "../../loading";
import { UserData, DecodedData } from "@/app/lib/definitions";
import UserFormModal from "../ConfirmedBeneficiaryModal";
import {
  fetchBeneficiaryByCalamityAndId,
  getAllCalamity,
} from "@/app/lib/api/calamity/data";

interface ModalProps {
  onClose: () => void;
}

export const VerifyBeneficiary: React.FC<ModalProps> = ({ onClose }) => {
  const [decodedData, setDecodedData] = useState<DecodedData | null>(null);
  const [beneficiaryData, setBeneficiaryData] = useState<UserData>();
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [verificationMessage, setVerificationMessage] = useState<string | null>(
    null
  );
  const [isBeneficiaryFound, setIsBeneficiaryFound] = useState<boolean>(false);
  const [qualifiedCalamities, setQualifiedCalamities] = useState<string[]>([]);
  const [selectedCalamity, setSelectedCalamity] = useState<string | null>(null);
  const verificationDoneRef = useRef(false);

  const handleScan = (data: string | null) => {
    if (decodedData === null && data && isScanning) {
      try {
        const parsedData = JSON.parse(data);
        const usableObject: DecodedData = {
          id: parsedData.id ?? "",
          brgyName: parsedData.brgyName ?? "",
          calamityName: parsedData.calamityName ?? "",
        };

        if (usableObject.id && usableObject.brgyName) {
          setDecodedData(usableObject);
          setError(null);
          setIsScanning(false);
        } else {
          throw new Error("Invalid QR code data: Missing required fields.");
        }
      } catch (e) {
        setError("Invalid QR code data. Unable to parse.");
      }
    }
  };

  const handleError = (err: any) => {
    setError("Error reading QR code. Please try again.");
  };

  const handleVerify = async (brgyName: string, id: string) => {
    try {
      showLoading();
      const result = await verifyRecipient(brgyName, id);
      hideLoading();
      verificationDoneRef.current = true;

      if (result.found) {
        setVerificationMessage("Beneficiary Found!");
        setIsBeneficiaryFound(true);
        setBeneficiaryData(result.beneficiaryData as UserData | undefined);

        const allCalamities = await getAllCalamity();
        const qualifiedCalamitiesList: string[] = [];

        for (const calamity of allCalamities) {
          const calamityResult = await fetchBeneficiaryByCalamityAndId(
            calamity.name,
            id
          );
          if (calamityResult && calamityResult.isQualified) {
            qualifiedCalamitiesList.push(calamity.name);
          }
        }

        setQualifiedCalamities(qualifiedCalamitiesList);
      } else {
        setVerificationMessage("No Beneficiary Found!");
      }
    } catch (error) {
      setVerificationMessage("Verification failed. Please try again.");
      hideLoading();
    }
  };

  useEffect(() => {
    if (decodedData !== null && !verificationDoneRef.current) {
      handleVerify(decodedData.brgyName, decodedData.id);
    }
  }, [decodedData]);

  const handleModalToggle = () => {
    setIsModalOpen((prev) => !prev);
  };

  const handleCalamitySelection = (calamity: string) => {
    setSelectedCalamity(calamity);
  };

  const renderQrReader = () => (
    <div className="w-96">
      <QrReader
        scanDelay={1000}
        onResult={(result, error) => {
          if (result && isScanning) handleScan(result?.getText() ?? null);
          if (error) handleError(error);
        }}
        constraints={{ facingMode: "environment" }}
      />
    </div>
  );

  const renderVerificationResult = () => (
    <div className="mt-4 flex flex-col items-center gap-2">
      <Image
        src={isBeneficiaryFound ? "/icon/success.svg" : "/icon/not-found.svg"}
        alt=""
        width={200}
        height={200}
      />
      <h3
        className={clsx("font-bold text-xl text-center mt-4", {
          "text-green-500": isBeneficiaryFound,
          "text-red-500": !isBeneficiaryFound,
        })}
      >
        {verificationMessage || "No Beneficiary Found"}
      </h3>

      {!verificationMessage && (
        <h4 className="mt-2 opacity-60 w-3/4 text-center">
          Please wait while we verify the beneficiary from the Database.
        </h4>
      )}

      {isBeneficiaryFound && qualifiedCalamities.length > 0 ? (
        <div className="flex flex-col items-center gap-2">
          <h4 className="text-lg font-semibold">Qualified Calamities:</h4>
          <div className="flex flex-wrap gap-2">
            {qualifiedCalamities.map((calamity) => (
              <button
                key={calamity}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
                onClick={() => handleCalamitySelection(calamity)}
              >
                {calamity}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <h4 className="text-lg font-semibold text-red-500">
          No qualified calamities found.
        </h4>
      )}

      {selectedCalamity && (
        <button
          className="bg-green-700 hover:bg-green-500 p-2 px-4 text-white rounded-md mt-4"
          onClick={handleModalToggle}
        >
          Release Benefits
        </button>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 h-full bg-black bg-opacity-50 flex justify-center items-center z-10">
      <div className="flex flex-col gap-4 justify-between items-center bg-gray-100 text-gray-900 p-8 rounded-lg w-fit h-fit overflow-auto max-w-screen-lg mx-4 my-6 relative min-w-96 border-2">
        {!decodedData && (
          <h2 className="text-2xl font-bold text-center">
            Beneficiary QR Code Scanner
          </h2>
        )}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-700"
        >
          ✖
        </button>
        {decodedData === null && isScanning && renderQrReader()}
        {decodedData && verificationMessage && renderVerificationResult()}
        {error && !decodedData && (
          <p className="text-red-500 text-sm font-semibold -mt-6 text-center">
            Please align the code properly to decode.
          </p>
        )}
        {isModalOpen && beneficiaryData && decodedData && (
          <UserFormModal
            onClose={onClose}
            data={beneficiaryData}
            decodedData={decodedData}
          />
        )}
      </div>
    </div>
  );
};
