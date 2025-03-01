"use client";

import React, { useState, useEffect, useRef } from "react";
import { QrReader } from "react-qr-reader";
import Image from "next/image";
import { verifyRecipient } from "@/app/lib/api/beneficiary/data";
import clsx from "clsx";
import { showLoading, hideLoading } from "../../loading";
import { UserData, DecodedData } from "@/app/lib/definitions";
import UserFormModal from "../ConfirmedBeneficiaryModal";
import { calamityTypes } from "@/app/config/calamity";
import { fetchBeneficiaryByCalamityAndId } from "@/app/lib/api/calamity/data";

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
  const [qualifiedCalamities, setQualifiedCalamities] = useState<string[]>([]); // Store qualified calamities
  const verificationDoneRef = useRef(false); // Flag to track if verification is done

  const handleScan = (data: string | null) => {
    console.log("handleScan called with data:", data);
    if (decodedData === null && data && isScanning) {
      try {
        // Parse the data string into a JavaScript object
        const parsedData = JSON.parse(data);
        console.log("Parsed data:", parsedData);

        // Validate and set only the required fields: id and brgyName
        const usableObject: DecodedData = {
          id: parsedData.id ?? "",
          brgyName: parsedData.brgyName ?? "",
          calamityName: parsedData.calamityName ?? "",
        };

        // Check if id and brgyName exist before setting the state
        if (usableObject.id && usableObject.brgyName) {
          setDecodedData(usableObject);
          setError(null);
          setIsScanning(false);
          console.log("Decoded data set:", usableObject);
        } else {
          throw new Error("Invalid QR code data: Missing required fields.");
        }
      } catch (e) {
        console.error("Error parsing QR code data:", e);
        setError("Invalid QR code data. Unable to parse.");
      }
    }
  };

  const handleError = (err: any) => {
    console.error("Error reading QR code:", err);
    setError("Error reading QR code. Please try again.");
  };

  // handleVerify function adjusted to accept parameters directly from state
  const handleVerify = async (brgyName: string, id: string) => {
    console.log("handleVerify called with brgyName:", brgyName, "id:", id);
    try {
      showLoading();
      const result = await verifyRecipient(brgyName, id);
      hideLoading();
      verificationDoneRef.current = true; // Set flag to true after verification

      console.log("Verification result:", result);

      if (result.found) {
        setVerificationResult("Beneficiary Found!");
        setFound(true);
        setBeneficiaryData(result.beneficiaryData as UserData | undefined);

        // Check qualified calamities
        const qualifiedCalamitiesList: string[] = [];
        for (const calamity of calamityTypes) {
          const calamityResult = await fetchBeneficiaryByCalamityAndId(
            calamity,
            id
          );
          if (calamityResult && calamityResult.isQualified) {
            qualifiedCalamitiesList.push(calamity);
          }
        }
        setQualifiedCalamities(qualifiedCalamitiesList);
      } else {
        setVerificationResult("No Beneficiary Found!");
      }
    } catch (error) {
      console.error("Error during verification:", error);
      setVerificationResult("Verification failed. Please try again.");
      hideLoading();
    }
  };

  // useEffect will trigger handleVerify only once when decodedData is set
  useEffect(() => {
    if (decodedData !== null && !verificationDoneRef.current) {
      console.log("Triggering handleVerify with decodedData:", decodedData);
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

            {found && qualifiedCalamities.length > 0 ? (
              <div className="flex flex-col items-center gap-2">
                <h4 className="text-lg font-semibold">Qualified Calamities:</h4>
                <div className="flex flex-wrap gap-2">
                  {qualifiedCalamities.map((calamity) => (
                    <button
                      key={calamity}
                      className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
                      onClick={() => handleModalForm()}
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
