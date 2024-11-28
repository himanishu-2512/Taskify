"use client"
import { useRouter } from "next/navigation";
import React from "react";


const HomePage = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50">
      <h1 className="text-5xl font-bold text-blue-600 mb-4">Welcome to Taskify</h1>
      <p className="text-lg text-gray-700 mb-6">
        Document and manage your tasks efficiently and with ease.
      </p>
      <button
        onClick={() => router.push("/login")}
        className="bg-blue-600 text-white py-2 px-6 rounded-md shadow-md hover:bg-blue-700 transition duration-200"
      >
        Get Started
      </button>
    </div>
  );
};

export default HomePage;
