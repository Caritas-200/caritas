"use client";

import React, { useState, ChangeEvent } from "react";
import Link from "next/link";
import { login } from "./lib/api/auth/login";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await login(email, password);

    if (!response.error) {
      Swal.fire({
        title: "Login Success!",
        text: "You have successfully logged in.",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        router.push("/home");
      });
    } else {
      Swal.fire({
        title: "Login Failed",
        text: "Invalid email or password.",
        icon: "error",
        confirmButtonText: "Try Again",
      });
    }
  };

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl text-gray-700 font-bold text-center mb-4">
          CARITAS
        </h1>
        <h2 className="text-lg text-gray-700 font-semibold text-center mb-8">
          Login Now
        </h2>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 font-semibold mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
              className="w-full text-gray-500 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={handleEmailChange}
              required
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-700 font-semibold mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full text-gray-500 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={handlePasswordChange}
              required
            />
          </div>

          <div className="mb-4 text-center">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Login
            </button>
          </div>
        </form>

        <div className="text-center">
          <span className="text-gray-700">No Account? Register </span>
          <Link href="/signup">
            <button className="text-blue-500 hover:underline">Here</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
