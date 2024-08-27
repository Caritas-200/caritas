type FormData = {
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

type ErrorState = {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  email?: string;
  mobileNumber?: string;
  position?: string;
  password?: string;
  confirmPassword?: string;
};

// Define the validateForm function
export const validateForm = (
  formData: FormData,
  setErrors: React.Dispatch<React.SetStateAction<ErrorState>>
): boolean => {
  const newErrors: ErrorState = {};

  if (!/^[A-Za-z]+$/.test(formData.firstName)) {
    newErrors.firstName = "Invalid First Name";
  }

  if (formData.middleName && !/^[A-Za-z]*$/.test(formData.middleName)) {
    newErrors.middleName = "Invalid Middle Name";
  }

  if (!/^[A-Za-z]+$/.test(formData.lastName)) {
    newErrors.lastName = "Invalid Last Name";
  }

  if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(formData.email)) {
    newErrors.email = "Invalid Email Address";
  }

  if (!/^\d{10}$/.test(formData.mobileNumber)) {
    newErrors.mobileNumber = "Invalid Mobile Number";
  }

  if (!/^[A-Za-z]+$/.test(formData.position)) {
    newErrors.position = "Invalid Position";
  }

  if (formData.password.length < 6) {
    newErrors.password = "Password must be at least 6 characters";
  }

  if (formData.password !== formData.confirmPassword) {
    newErrors.confirmPassword = "Passwords do not match";
  }

  setErrors(newErrors);

  return Object.keys(newErrors).length === 0;
};
