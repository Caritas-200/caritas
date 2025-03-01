"use client";

import React, { useState, useEffect } from "react";
import { UserProfile } from "@/app/lib/definitions";
import Header from "@/app/components/Header";
import LeftNav from "@/app/components/Nav";
import {
  fetchUserProfile,
  updateUserProfile,
  updateUserPassword,
} from "@/app/lib/api/profile/data";
import Swal from "sweetalert2";
import { showLoading, hideLoading } from "@/app/components/loading";
import { validateProfileForm } from "@/app/util/validateProfileForm";
import { logoutUser } from "@/app/lib/api/auth/data";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/app/layouts/MainLayout";

const Profile: React.FC = () => {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile>({
    firstName: "",
    middleName: "",
    lastName: "",
    status: "",
    email: "",
    mobileNumber: "",
    gender: "",
    position: "",
    address: "",
    dateCreated: "",
    password: "",
  });

  const [initialProfile, setInitialProfile] = useState<UserProfile>(profile);
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<{ [key in keyof UserProfile]?: string }>(
    {}
  );

  // Fetch profile data on component mount
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const userProfile = await fetchUserProfile();
        setProfile(userProfile);
        setInitialProfile(userProfile); // Store the initial profile state
      } catch (error) {
        Swal.fire("Error", "Failed to load user profile", "error");
      }
    };

    loadUserProfile();
  }, []);

  // Handle profile updates
  const handleUpdateProfile = async () => {
    const validationErrors = validateProfileForm(profile);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      // If there are validation errors, do not proceed
      return;
    }

    try {
      await updateUserProfile(profile);

      Swal.fire("Success", "Profile updated successfully", "success");
      setInitialProfile(profile); // Update the initial profile state
    } catch (error) {
      Swal.fire("Error", "Failed to update profile", "error");
    }
  };

  const handleUpdatePassword = async () => {
    try {
      showLoading();
      if (!password) {
        hideLoading();
        Swal.fire("Error", "Please provide a new password.", "error");
        return;
      }

      // Call the password update function
      const result = await updateUserPassword(password);

      hideLoading();
      Swal.fire({
        title: "Success",
        text: result.message, // Use the message from the function's return
        icon: "success",
        confirmButtonText: "OK",
      });

      if (result.status === 200) {
        await logoutUser();
        router.push("/");
      }
    } catch (error: any) {
      hideLoading();

      // Display a specific error message if available, or a default one
      Swal.fire(
        "Error",
        error.message ||
          "An unexpected error occurred. Please try again later.",
        "error"
      );
    }
  };

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setProfile({ ...profile, [field]: value });

    // Clear the error for the field being updated
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const renderInputField = (
    label: string,
    field: keyof UserProfile,
    type: string = "text",
    isDropdown: boolean = false,
    options: string[] = []
  ) => (
    <div className="mb-4 w-full px-2">
      <label className="text-text-color">{label}:</label>
      {isDropdown ? (
        <select
          className="bg-white-primary shadow-inner text-text-color py-2 px-4 rounded-lg w-full"
          value={profile[field]}
          onChange={(e) => handleInputChange(field, e.target.value)}
        >
          <option value="">Select {label}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          className={`${
            field === "email"
              ? "bg-gray-200 py-2 px-4 rounded-lg w-full outline-none"
              : "bg-white-primary shadow-inner text-text-color py-2 px-4 rounded-lg w-full outline-none"
          } `}
          value={profile[field]}
          onChange={(e) => handleInputChange(field, e.target.value)}
          readOnly={field === "email"} // Make email field read-only
        />
      )}
      {errors[field] && (
        <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
      )}
    </div>
  );

  // Check if the profile has been modified
  const isProfileModified =
    JSON.stringify(profile) !== JSON.stringify(initialProfile);

  // Check if the password has been modified
  const isPasswordModified = password !== "";

  return (
    <MainLayout>
      <div className="w-full overflow-y-auto ">
        <div className="p-4 bg-bg-color pt-10 min-h-screen text-text-color">
          <div className="flex justify-between items-center pb-6">
            <h1 className="text-2xl font-bold">User Profile</h1>
          </div>

          <div className="grid  gap-2 w-full sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {renderInputField("Email", "email", "email")}
            {renderInputField("First Name", "firstName")}
            {renderInputField("Middle Name", "middleName")}
            {renderInputField("Last Name", "lastName")}
            {renderInputField("Mobile Number", "mobileNumber")}
            {renderInputField("Gender", "gender", "text", true, [
              "Male",
              "Female",
            ])}
            {renderInputField("Status", "status", "text", true, [
              "Single",
              "Married",
              "Divorced",
              "Widowed",
            ])}
            {renderInputField("Position", "position")}
            {renderInputField("Address", "address")}
          </div>

          <div className="flex space-x-4 mt-4">
            <button
              className={` text-white py-2 px-4 rounded-lg ${
                !isProfileModified ? "bg-gray-400" : "bg-green-500"
              } `}
              onClick={handleUpdateProfile}
              disabled={!isProfileModified} // Disable button if no changes
            >
              Save Changes
            </button>
          </div>

          <div className="mt-6">
            <label className="text-text-color">Change Password:</label>
            <input
              type="password"
              className="bg-white-primary text-text-color py-2 px-4 rounded-lg w-full outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              onClick={handleUpdatePassword}
              className={`py-2 px-4 rounded-lg mt-4 text-white ${
                !isPasswordModified ? "bg-gray-400" : "bg-blue-500"
              }`}
              disabled={!isPasswordModified} // Disable button if no changes
            >
              Update Password
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
