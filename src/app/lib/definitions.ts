import { Timestamp } from "firebase/firestore";

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

export type Address = {
  region: {
    region_id: string;
    region_name: string;
  };
  province: {
    province_id: string;
    region_id: string;
    province_name: string;
  };
  cityMunicipality: {
    municipality_id: string;
    province_id: string;
    municipality_name: string;
  };
  barangay: {
    barangay_id: string;
    municipality_id: string;
    barangay_name: string;
  };
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

type FirebaseTimestamp = Timestamp | { seconds: number; nanoseconds: number };

export type BeneficiaryForm = {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  mobileNumber: string;
  age: string;
  houseNumber?: string;
  address: Address;
  gender: string;
  occupation: string;
  civilStatus: string;
  monthlyNetIncome: string;
  ethnicity: string;
  dateCreated: FirebaseTimestamp;
  religion: string;
  email: string;
  familyMembers?: FamilyMember[];
  beneficiary4Ps: string;
  ownershipRentalType: string[];
  code: string[];
  qrCode: string;
};

// New type that extends BeneficiaryForm with additional fields from calamity collection
export type CalamityBeneficiary = BeneficiaryForm & {
  isQualified?: boolean;
  isClaimed?: boolean;
  dateVerified?: FirebaseTimestamp;
  beneficiaryName?: string;
  calamity?: string;
  calamityName?: string;
  brgyName?: string;
  claimantImage?: string;
  claimantName?: string;
  donationType?: string;
  cost?: string;
  quantity?: string;
  housingCondition?: string;
  casualty?: string;
  healthCondition?: string;
};

export type UserData = Pick<
  BeneficiaryForm & CalamityBeneficiary,
  | "dateCreated"
  | "familyMembers"
  | "firstName"
  | "lastName"
  | "middleName"
  | "housingCondition"
  | "casualty"
  | "healthCondition"
  | "calamity"
  | "calamityName"
>;

export type DonorFormData = {
  id: string;
  donorName: string;
  mobileNumber: string;
  dateCreated: Timestamp;
  age: string;
  address: string;
  country: string;
  status: string;
  gender: string;
  work: string;
  civilStatus: string;
  language: string;
  religion: string;
  email: string;
  donationType: string[];
};

export type DonorType = {
  id: string;
  donorName: string;
  mobileNumber: string;
  age: string;
  address: string;
  country: string;
  status: string;
  gender: string;
  work: string;
  civilStatus: string;
  language: string;
  religion: string;
  email: string;
};

export interface Event {
  event: string[];
  timestamp: Timestamp; // Use Timestamp here if that's your requirement
}

export interface EventMap {
  [key: string]: Event[];
}

export interface UserProfile {
  address: string;
  dateCreated: string;
  email: string;
  firstName: string;
  gender: string;
  lastName: string;
  middleName: string;
  mobileNumber: string;
  position: string;
  status: string;
  password: string;
}

export interface DecodedData {
  id: string;
  calamityName: string;
}
