"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { signup } from "@/app/lib/api/auth/signup";
import { validateForm } from "@/app/util/formValidation";
import { showLoading, hideLoading } from "@/app/components/loading";
import { SignUpFormData } from "@/app/lib/definitions";
import {
  inputFieldsSignUp,
  genderOptionsSignUp,
  statusOptionsSignUp,
} from "@/app/config/formConfig";

interface ErrorState {
  [key: string]: string;
}

const SignUp: React.FC = () => {
  const [formData, setFormData] = useState<SignUpFormData>({
    firstName: "",
    middleName: "",
    lastName: "",
    status: "",
    email: "",
    mobileNumber: "",
    gender: "",
    position: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<ErrorState>({});
  const router = useRouter();

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    showLoading();

    if (!validateForm(formData, setErrors)) {
      hideLoading();
      return;
    }

    // API Call
    const response = await signup(formData);
    hideLoading();

    if (!response.error) {
      Swal.fire({
        title: "Registration Successful!",
        text: "You have successfully registered.",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        router.push("/home");
      });
    } else {
      Swal.fire({
        title: "Error",
        text: response.message,
        icon: "error",
        confirmButtonText: "Try Again",
      });
    }
  };

  return (
    <div className="flex justify-center items-center h-full py-10 bg-gray-100">
      <div className="w-full max-w-3xl bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl text-gray-700 font-bold text-center mb-4">
          SIGN-UP
        </h1>
        <h2 className="text-lg text-gray-700 font-semibold text-center mb-8">
          Fill in your personal details
        </h2>

        <form onSubmit={handleRegister}>
          <div className="flex flex-wrap -mx-2">
            {inputFieldsSignUp.map((field, index) => (
              <div key={index} className="w-full md:w-1/2 px-2 mb-4">
                <label
                  htmlFor={field.name}
                  className="block text-gray-700 font-semibold mb-2"
                >
                  {field.label}
                </label>
                <input
                  type={field.type}
                  id={field.name}
                  name={field.name}
                  value={formData[field.name as keyof typeof formData]}
                  onChange={handleChange}
                  className={`w-full text-gray-500 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors[field.name]
                      ? "border-red-500"
                      : "focus:ring-blue-500"
                  }`}
                  required={field.required}
                />
                {errors[field.name] && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors[field.name]}
                  </p>
                )}
              </div>
            ))}

            {/* Status Dropdown */}
            <div className="w-full md:w-1/2 px-2 mb-4">
              <label
                htmlFor="status"
                className="block text-gray-700 font-semibold mb-2"
              >
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={`w-full text-gray-500 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.status ? "border-red-500" : "focus:ring-blue-500"
                }`}
              >
                <option value="">Select Status</option>
                {statusOptionsSignUp.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors.status && (
                <p className="text-red-500 text-sm mt-1">{errors.status}</p>
              )}
            </div>

            {/* Gender Dropdown */}
            <div className="w-full md:w-1/2 px-2 mb-4">
              <label
                htmlFor="gender"
                className="block text-gray-700 font-semibold mb-2"
              >
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className={`w-full text-gray-500 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.gender ? "border-red-500" : "focus:ring-blue-500"
                }`}
              >
                <option value="">Select Gender</option>
                {genderOptionsSignUp.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors.gender && (
                <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
              )}
            </div>
          </div>

          <div className="mb-4 text-center">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Register
            </button>
          </div>
        </form>

        <div className="text-center">
          <span className="text-gray-700">Already have an account? Login </span>
          <Link href="/">
            <button className="text-blue-500 hover:underline">Here</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
