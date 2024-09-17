import React from "react";
import QRCode from "react-qr-code";
import Swal from "sweetalert2"; // Assuming you're using Swal2 for notifications

interface QRModalProps {
  beneficiaryData: string;
  qrData: string;
  onClose: () => void;
}

const BeneficiaryIdQr: React.FC<QRModalProps> = ({
  beneficiaryData,
  qrData,
  onClose,
}) => {
  const newObject = JSON.parse(beneficiaryData);

  // Safely extract address fields and construct the full address
  const fullAddress = [
    newObject.address?.barangay?.barangay_name,
    newObject.address?.cityMunicipality?.municipality_name,
    newObject.address?.province?.province_name,
  ]
    .filter(Boolean)
    .join(", ");

  // Function to handle closing the modal
  const handleClose = () => {
    Swal.fire({
      title: "Reminder",
      text: "Don't forget to print the Beneficiary ID. This will be needed for smooth claiming of benefits",
      icon: "info",
      confirmButtonText: "Close",
      cancelButtonText: "Back",
      showCancelButton: true,
      cancelButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed) {
        onClose();
      }
    });
  };

  // Data to display on the ID
  const dataItems = [
    { label: "House #", value: newObject.houseNumber },
    { label: "Age", value: newObject.age },
    { label: "Gender", value: newObject.gender },
  ];

  // Print function
  const handlePrint = () => {
    const printWindow = window.open("", "", "height=2550,width=3200");
    if (printWindow) {
      printWindow.document.write("<html><head><title>Print ID</title>");
      printWindow.document.write("<style>"); // Add your print styles here
      printWindow.document.write(`
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
        }
        .id-front-photo {
          border: 1px solid #ddd;
          width: 1in;
          height: 1in;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 20px;
          margin-left: 30px;
        }
        .id-front-qr {
          display: flex;
          justify-content: flex-end;
        }
        .id-front-name {
          font-size: 1.25rem;
          margin-top: 1rem;
          font-weight: bold;
        }
        .id-front-details {
          margin-top: 1rem;
        }
        .address-label, .family-label {
          font-weight: bold;
        }
        .detail-label {
          font-weight: bold;
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
    <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="modal-content bg-white p-10 rounded-lg w-full max-w-screen-lg relative">
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
        <button
          onClick={handlePrint}
          className="print-button mt-4 mb-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Print ID
        </button>

        {/* Print Area */}
        <div
          id="printArea"
          className="print-area grid grid-cols-2 gap-8 text-gray-700"
        >
          {/* Front of the ID */}
          <div className="id-front border-2 p-4 id-front-container">
            <div className="id-front-content grid grid-cols-2">
              {/* 1x1 image placeholder */}
              <div className="id-front-photo flex w-full justify-center items-center">
                <div className="photo-placeholder border-4 border-gray-300 border-dotted w-24 h-24 bg-gray-100 flex items-center justify-center">
                  <span className="photo-text text-gray-400">1x1 Photo</span>
                </div>
              </div>

              {/* QR Code */}
              <div className="id-front-qr flex justify-end">
                <QRCode value={qrData} size={150} />
              </div>
            </div>

            <p className="id-front-name font-bold text-xl pt-6">
              {newObject.firstName +
                " " +
                newObject.middleName +
                " " +
                newObject.lastName}
            </p>

            <div className="id-front-details mt-4 grid grid-cols-2">
              {dataItems.map((item) => (
                <p key={item.label} className="detail-item">
                  <span className="detail-label font-semibold">
                    {item.label}:{" "}
                  </span>
                  {item.value}
                </p>
              ))}
            </div>
          </div>

          {/* Back of the ID */}
          <div className="id-back border-2 p-4 id-back-container">
            <div className="id-back-address mt-2">
              <p className="address-label font-bold">Address/Tirahan:</p>
              <p className="address-value">Brgy. {fullAddress || "N/A"}</p>
            </div>

            <div className="id-back-family mt-4">
              <p className="family-label font-bold">
                Allowed Family Members to Claim:
              </p>
              <ul className="family-list list-disc list-inside">
                {newObject.familyMembers?.map((member: any, index: number) => (
                  <p key={index} className="family-member">
                    <strong>{index + 1 + "."}</strong> {member.name}
                  </p>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeneficiaryIdQr;
