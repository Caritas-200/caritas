import { convertFirebaseTimestamp } from "./firebaseTimestamp";
import { toSentenceCase } from "./toSentenceCase";
import { fetchBeneficiaries } from "@/app/lib/api/beneficiary/data";
import { CalamityBeneficiary } from "@/app/lib/definitions";

export const printQualifiedBeneficiaries = async (
  calamityData: { name: string; calamityType: string },
  beneficiaries: CalamityBeneficiary[]
) => {
  console.log("Original Beneficiaries:", beneficiaries);

  // Fetch additional fields for each beneficiary
  const enrichedBeneficiaries = await Promise.all(
    beneficiaries.map(async (beneficiary) => {
      if (beneficiary.brgyName) {
        const result = await fetchBeneficiaries(beneficiary.brgyName);
        if (result.length > 0) {
          const matchedBeneficiary = result.find(
            (b) => b.id === beneficiary.id
          );
          if (matchedBeneficiary) {
            return { ...matchedBeneficiary, ...beneficiary };
          }
        }
      }
      return beneficiary;
    })
  );

  console.log("Enriched Beneficiaries:", enrichedBeneficiaries);

  const printWindow = window.open("", "", "height=4200,width=2550");
  if (printWindow) {
    printWindow.document.writeln(
      "<html><head><title>Print Qualified Beneficiaries</title>"
    );
    printWindow.document.writeln("<style>");
    printWindow.document.writeln(`
      @page {
        size: landscape;
      }
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
    printWindow.document.writeln("</style></head><body>");
    printWindow.document.writeln(
      `<h2>Qualified Beneficiaries for ${
        calamityData.calamityType + " " + calamityData.name
      } </h2>`
    );
    printWindow.document.writeln("<table>");
    printWindow.document.writeln("<thead><tr>");
    printWindow.document.writeln("<th>#</th>");
    printWindow.document.writeln("<th>Name</th>");
    printWindow.document.writeln("<th>Age</th>");
    printWindow.document.writeln("<th>Mobile Number</th>");
    printWindow.document.writeln("<th>Cost</th>");
    printWindow.document.writeln("<th>Donation Type</th>");
    printWindow.document.writeln("<th>Status</th>");
    printWindow.document.writeln("<th>Date Claimed</th>");
    printWindow.document.writeln("<th>Address</th>");
    printWindow.document.writeln("</tr></thead><tbody>");

    enrichedBeneficiaries.forEach((beneficiary, index) => {
      printWindow.document.writeln("<tr>");
      printWindow.document.writeln(`<td>${index + 1}</td>`);
      printWindow.document.writeln(
        `<td>${beneficiary.lastName}, ${beneficiary.firstName}</td>`
      );
      printWindow.document.writeln(`<td>${beneficiary.age || "N/A"}</td>`);
      printWindow.document.writeln(
        `<td>${beneficiary.mobileNumber || "N/A"}</td>`
      );
      printWindow.document.writeln(
        `<td>${beneficiary.cost ? beneficiary.cost : "N/A"}</td>`
      );
      printWindow.document.writeln(
        `<td>${
          beneficiary.donationType ? beneficiary.donationType : "N/A"
        }</td>`
      );
      printWindow.document.writeln(
        `<td>${beneficiary.isClaimed ? "Claimed" : "Unclaimed"}</td>`
      );
      printWindow.document.writeln(
        `<td>${
          beneficiary.dateClaimed
            ? convertFirebaseTimestamp(beneficiary.dateClaimed)
            : "N/A"
        }</td>`
      );
      printWindow.document.writeln(
        `<td>${
          beneficiary.brgyName ? toSentenceCase(beneficiary.brgyName) : "N/A"
        }</td>`
      );
      printWindow.document.writeln("</tr>");
    });

    printWindow.document.writeln("</tbody></table>");
    printWindow.document.writeln("</body></html>");
    printWindow.document.close();
    printWindow.print();
  }
};
