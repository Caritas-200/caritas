export type BeneficiaryForm = {
  firstName: string;
  middleName?: string;
  lastName: string;
  mobileNumber: string;
  age: string;
  address: string;
  gender: string;
  work?: string;
  status: string;
  language?: string;
  religion?: string;
  email?: string;
  housingCondition: string[];
  casualty: string[];
  healthCondition: string[];
  ownershipRentalType: string[];
  vulnerableGroup: string[];
};
