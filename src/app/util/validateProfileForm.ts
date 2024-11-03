import { UserProfile } from "../lib/definitions";

// Function to validate the profile form
export const validateProfileForm = (profile: UserProfile) => {
  const errors: { [key: string]: string } = {};

  // Validate first name
  if (!profile.firstName.trim()) {
    errors.firstName = "First name is required.";
  }

  // Validate last name
  if (!profile.lastName.trim()) {
    errors.lastName = "Last name is required.";
  }

  // Validate email
  if (!profile.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
    errors.email = "Please enter a valid email address.";
  }

  // Validate mobile number (example format: at least 10 digits)
  if (!profile.mobileNumber.trim()) {
    errors.mobileNumber = "Mobile number is required.";
  } else if (!/^\d{10,}$/.test(profile.mobileNumber)) {
    errors.mobileNumber =
      "Please enter a valid mobile number with at least 10 digits.";
  }

  // Validate gender
  if (!profile.gender.trim()) {
    errors.gender = "Gender is required.";
  }

  // Validate status
  if (!profile.status.trim()) {
    errors.status = "Status is required.";
  }

  // Validate position
  if (!profile.position.trim()) {
    errors.position = "Position is required.";
  }

  // Validate address
  if (!profile.address.trim()) {
    errors.address = "Address is required.";
  }

  return errors;
};
