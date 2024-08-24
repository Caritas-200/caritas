import React from "react";
import Link from "next/link";

const Login: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl text-gray-700 font-bold text-center mb-4">
          CARITAS
        </h1>
        <h2 className="text-lg text-gray-700 font-semibold text-center mb-8">
          Login Now
        </h2>

        <form>
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
              className="w-full text-gray-500 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
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

          <div className="text-center">
            <span className="text-gray-700">No Account? Register </span>
            <Link href="/sign-up">
              <button className="text-blue-500 hover:underline">Here</button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
