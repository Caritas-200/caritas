import React, { useState } from "react";
import QRCode from "react-qr-code";
import Image from "next/image";
import { BeneficiaryForm } from "@/app/lib/definitions";

interface QRModalProps {
  beneficiaryData: string;
  qrData: string;
  onClose: () => void;
  from: string;
}

const BeneficiaryIdQr: React.FC<QRModalProps> = ({
  beneficiaryData,
  qrData,
  onClose,
  from,
}) => {
  const newObject = JSON.parse(beneficiaryData);
  const [beneficiary, setBeneficiary] = useState<BeneficiaryForm>(newObject);
  const [isLoading, setIsLoading] = useState(true);

  // Safely extract address fields and construct the full address
  const fullAddress = [
    beneficiary.address?.barangay?.barangay_name,
    beneficiary.address?.cityMunicipality?.municipality_name,
    beneficiary.address?.province?.province_name,
  ]
    .filter(Boolean)
    .join(", ");

  // Function to handle closing the modal
  const handleClose = () => {
    onClose();
  };

  // Data to display on the ID
  const dataItems = [
    { label: "House #", value: beneficiary.houseNumber },
    { label: "Age", value: beneficiary.age },
    { label: "Gender", value: beneficiary.gender },
  ];

  // Print function
  const handlePrint = () => {
    const printWindow = window.open("", "", "height=2550,width=3200");
    if (printWindow) {
      printWindow.document.write("<html><head><title>Print ID</title>");
      printWindow.document.write("<style>");
      printWindow.document.write(`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');
        body {
          font-family: 'DM Sans', sans-serif;
        }
        .print-area {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          width: 100%;
        }
        .id-front-container, .id-back-container {
          border: 1px solid #000;
          padding: 1rem;
          width: 5in;
          height: 3in;
          margin-bottom: 20px;
          padding: 30px;
          position: relative;
        }
        .id-front-photo {
          border: 1px solid #ddd;
          width: 1in;
          height: 1in;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-left: 0;
          position: absolute;
          top: 30px;
          left: 30px;
          background-color: #f0f0f0;
        }
        .id-front-qr {
          position: absolute;
          top: 30px;
          right: 30px;
        }
        .id-front-name {
          font-size: 1.25rem;
          margin-top: 1.5in;
          font-weight: 700;
          text-align: left;
     
        }
        .id-front-details {
          margin-top: 0.5rem;
          text-align: left;
          font-weight: 500;
        }
        .address-label, .family-label {
          font-weight: 700;
        }
        .detail-label {
          font-weight: 700;
        }
        .family-list {
          list-style-type: disc;
          list-style-position: inside;
        }
      `);
      printWindow.document.write("</style></head><body>");
      printWindow.document.write(
        document.getElementById("printArea")?.innerHTML || ""
      );
      printWindow.document.write("</body></html>");
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };

  return (
    <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center ">
      <div className="modal-content bg-white p-10 rounded-lg w-full h-fit max-w-5xl relative">
        <button
          onClick={handleClose}
          className="modal-close-button absolute top-2 right-2 text-gray-700"
        >
          ✖
        </button>

        <h1 className="modal-title text-gray-700 text-2xl font-bold mb-6">
          Beneficiary ID with QR
        </h1>
        <h2 className="modal-subtitle text-gray-500 mb-2">
          Please provide this upon claiming.
        </h2>

        {/* Print Button */}
        <div className="flex w-full justify-end">
          <button
            onClick={handlePrint}
            className="print-button mt-4 mb-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Print ID
          </button>
        </div>

        {/* Print Area */}
        <div
          id="printArea"
          className="print-area flex flex-row gap-8 text-gray-700 w-full justify-between items-center "
        >
          {/* Front of the ID */}
          <div className="id-front border-2 p-4 id-front-container w-2/3 h-[300px]">
            <div className="id-front-content grid grid-cols-2">
              {/* 1x1 image placeholder */}
              <div className="id-front-photo flex w-full justify-center items-center">
                <div className="photo-placeholder border-4 border-gray-300 border-dotted w-24 h-24 bg-gray-100 flex items-center justify-center">
                  <span className="photo-text text-gray-400">1x1 Photo</span>
                </div>
              </div>

              {/* QR Code */}
              <div className="id-front-qr flex justify-end">
                {from === "calamity" ? (
                  <>
                    {isLoading && (
                      <div className="flex items-center justify-center">
                        <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
                      </div>
                    )}
                    <Image
                      src={beneficiary.qrCode}
                      alt="QR Code"
                      width={150}
                      height={150}
                      onLoadingComplete={() => setIsLoading(false)}
                      placeholder="blur"
                      blurDataURL="/path/to/placeholder-image.jpg" // Replace with your placeholder image path
                    />
                  </>
                ) : (
                  <QRCode value={qrData} size={150} />
                )}
              </div>
            </div>

            <p className="id-front-name font-bold text-xl pt-6 uppercase">
              {beneficiary.firstName +
                " " +
                beneficiary.middleName +
                " " +
                beneficiary.lastName}
            </p>

            <div className="id-front-details mt-4 grid grid-cols-2">
              {dataItems.map(
                (item) =>
                  item.value && (
                    <p key={item.label} className="detail-item">
                      <span className="detail-label font-semibold">
                        {item.label}:{" "}
                      </span>
                      {item.value}
                    </p>
                  )
              )}
            </div>
          </div>

          {/* Back of the ID */}
          <div className="id-back border-2 p-4 id-back-container w-2/3 h-[300px]">
            <div className="id-back-address mt-2">
              <p className="address-label font-bold">Address/Tirahan:</p>
              <p className="address-value">Brgy. {fullAddress || "N/A"}</p>
            </div>

            <div className="id-back-family mt-4">
              <p className="family-label font-bold">
                Allowed Family Members to Claim:
              </p>
              <ul className="family-list list-disc list-inside">
                {beneficiary.familyMembers?.map(
                  (member: any, index: number) => (
                    <p key={index} className="family-member">
                      <strong>{index + 1 + "."}</strong> {member.name}
                    </p>
                  )
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeneficiaryIdQr;
