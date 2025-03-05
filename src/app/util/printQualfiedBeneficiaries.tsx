import { convertFirebaseTimestamp } from "./firebaseTimestamp";
import { toSentenceCase } from "./toSentenceCase";
import { fetchBeneficiaries } from "@/app/lib/api/beneficiary/data";
import { CalamityBeneficiary } from "@/app/lib/definitions";

export const printQualifiedBeneficiaries = async (
  calamityData: { name: string; calamityType: string },
  beneficiaries: CalamityBeneficiary[]
) => {
  // Fetch additional fields for each beneficiary
  const enrichedBeneficiaries = await Promise.all(
    beneficiaries.map(async (beneficiary) => {
      if (beneficiary.brgyName) {
        const result = await fetchBeneficiaries(beneficiary.brgyName);
        if (result.length > 0) {
          return { ...result[0], ...beneficiary };
        }
      }
      return beneficiary;
    })
  );

  const printWindow = window.open("", "", "height=4200,width=2550");
  if (printWindow) {
    printWindow.document.write(
      "<html><head><title>Print Qualified Beneficiaries</title>"
    );
    printWindow.document.write("<style>");
    printWindow.document.write(`
      body {
        font-family: Arial, sans-serif;
        margin: 20px;
      }
      table {
        width: 100%;
        border-collapse: collapse;
      }
      th, td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: left;
      }
      th {
        background-color: #f2f2f2;
      }
    `);
    printWindow.document.write("</style></head><body>");
    printWindow.document.write(
      `<h2>Qualified Beneficiaries for ${
        calamityData.calamityType + " " + calamityData.name
      } </h2>`
    );
    printWindow.document.write("<table>");
    printWindow.document.write("<thead><tr>");
    printWindow.document.write("<th>#</th>");
    printWindow.document.write("<th>Name</th>");
    printWindow.document.write("<th>Age</th>");
    printWindow.document.write("<th>Mobile Number</th>");
    printWindow.document.write("<th>Date Verified</th>");
    printWindow.document.write("<th>Address</th>");
    printWindow.document.write("</tr></thead><tbody>");

    enrichedBeneficiaries.forEach((beneficiary, index) => {
      printWindow.document.write("<tr>");
      printWindow.document.write(`<td>${index + 1}</td>`);
      printWindow.document.write(
        `<td>${beneficiary.lastName}, ${beneficiary.firstName}</td>`
      );
      printWindow.document.write(`<td>${beneficiary.age || "N/A"}</td>`);
      printWindow.document.write(
        `<td>${beneficiary.mobileNumber || "N/A"}</td>`
      );
      printWindow.document.write(
        `<td>${
          beneficiary.dateVerified
            ? convertFirebaseTimestamp(beneficiary.dateVerified)
            : "N/A"
        }</td>`
      );
      printWindow.document.write(
        `<td>${
          beneficiary.brgyName ? toSentenceCase(beneficiary.brgyName) : "N/A"
        }</td>`
      );
      printWindow.document.write("</tr>");
    });

    printWindow.document.write("</tbody></table>");
    printWindow.document.write("</body></html>");
    printWindow.document.close();
    printWindow.print();
  }
};
