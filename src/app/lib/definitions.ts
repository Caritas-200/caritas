export type SignUpFormData = {
  firstName: string;
  middleName?: string;
  lastName: string;
  status: string;
  email: string;
  mobileNumber: string;
  gender: string;
  position: string;
  address: string;
  password: string;
  confirmPassword: string;
};

export type BeneficiaryForm = {
  id?: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  mobileNumber: string;
  age: string;
  address: string;
  gender: string;
  occupation: string;
  civilStatus: string;
  status?: string;
  monthlyNetIncome: string;
  ethnicity: string;
  religion: string;
  email?: string;
  beneficiary4Ps: string;
  housingCondition: string[];
  casualty: string[];
  healthCondition: string[];
  ownershipRentalType: string[];
  code: string[];
};

export type FamilyMember = {
  name: string;
  relation: string;
  age: string;
  gender: string;
  civilStatus: string;
  education: string;
  skills: string;
  remarks?: string;
};
