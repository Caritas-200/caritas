"use client";

import React, { useState, useEffect, useRef } from "react";
import { QrReader } from "react-qr-reader";
import Image from "next/image";
import { verifyRecipient } from "@/app/lib/api/beneficiary/data";
import clsx from "clsx";
import { showLoading, hideLoading } from "../../loading";
import { UserData, DecodedData } from "@/app/lib/definitions";
import UserFormModal from "../ConfirmedBeneficiaryModal";

interface ModalProps {
  onClose: () => void;
}

export const VerifyBeneficiary: React.FC<ModalProps> = ({ onClose }) => {
  const [decodedData, setDecodedData] = useState<DecodedData | null>(null);
  const [beneficiaryData, setBeneficiaryData] = useState<UserData>();
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(true);
  const [modalView, setModalView] = useState<boolean>(false);
  const [verificationResult, setVerificationResult] = useState<string | null>(
    null
  ); // Store verification result
  const [found, setFound] = useState<boolean>(false); // Store verification result
  const verificationDoneRef = useRef(false); // Flag to track if verification is done

  const handleScan = (data: string | null) => {
    if (decodedData === null && data && isScanning) {
      try {
        // Parse the data string into a JavaScript object
        const parsedData = JSON.parse(data);

        // Validate and set only the required fields: id and brgyName
        const usableObject: DecodedData = {
          id: parsedData.id ?? "",
          brgyName: parsedData.brgyName ?? "",
        };

        // Check if id and brgyName exist before setting the state
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

  // handleVerify function adjusted to accept parameters directly from state
  const handleVerify = async (brgyName: string, id: string) => {
    try {
      showLoading();
      const result = await verifyRecipient(brgyName, id);
      hideLoading();
      verificationDoneRef.current = true; // Set flag to true after verification

      if (result.found) {
        setVerificationResult("Beneficiary Found!");
        setFound(true);
        setBeneficiaryData(result.beneficiaryData as UserData | undefined);
      } else {
        setVerificationResult("No Beneficiary Found!");
      }
    } catch (error) {
      setVerificationResult("Verification failed. Please try again.");
      hideLoading();
    }
  };

  // useEffect will trigger handleVerify only once when decodedData is set
  useEffect(() => {
    if (decodedData !== null && !verificationDoneRef.current) {
      handleVerify(decodedData.brgyName, decodedData.id);
    }
  }, [decodedData]);

  const handleModalForm = () => {
    setModalView((prev) => !prev);
  };

  return (
    <div className="fixed inset-0 h-full bg-black bg-opacity-50 flex justify-center items-center z-10">
      <div
        className={`flex flex-col gap-4 justify-between items-center bg-gray-100 text-gray-900 p-8 rounded-lg w-fit h-fit overflow-auto max-w-screen-lg mx-4 my-6 relative min-w-96 border-2 `}
      >
        {!decodedData && (
          <h2 className="text-2xl font-bold text-center">
            Beneficiary QR Code Scanner
          </h2>
        )}
        <button
          onClick={() => {
            onClose();
          }}
          className="absolute top-2 right-2 text-gray-700"
        >
          ✖
        </button>
        {decodedData === null && isScanning && (
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
        )}

        {decodedData && verificationResult && (
          <div className="mt-4 flex flex-col items-center gap-2">
            <Image
              src={found ? "/icon/success.svg" : "/icon/not-found.svg"}
              alt=""
              width={200}
              height={200}
            />
            <h3
              className={clsx("font-bold text-xl text-center mt-4", {
                "text-green-500": found,
                "text-red-500": !found,
              })}
            >
              {verificationResult || "No Beneficiary Found"}
            </h3>

            {!verificationResult && (
              <h4 className="mt-2 opacity-60 w-3/4 text-center">
                Please wait while we verify the beneficiary from the Database.
              </h4>
            )}

            <button
              className="bg-green-700 hover:bg-green-500 p-2 px-4 text-white rounded-md mt-4"
              onClick={() => {
                handleModalForm();
              }}
            >
              Release Benefits
            </button>
          </div>
        )}

        {error && !decodedData && (
          <p className="text-red-500 text-sm font-semibold -mt-6 text-center">
            Please align the code properly to decode.
          </p>
        )}

        {modalView && beneficiaryData && decodedData && (
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
