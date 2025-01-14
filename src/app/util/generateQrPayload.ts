interface BeneficiaryData {
  lastName: string;
  // Add other fields as needed
}

export const generateQrPayload = (
  newBeneficiaryId: string,
  beneficiaryData: BeneficiaryData,
  brgyName: string
) => {
  return {
    id: newBeneficiaryId,
    lastName: beneficiaryData.lastName,
    brgyName,
  };
};
