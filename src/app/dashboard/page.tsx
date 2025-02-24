"use client";
import React, { useEffect } from "react";
import { FaSignInAlt, FaUserPlus, FaCheck, FaSignOutAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const router = useRouter();
  const { user, logout } = useAuth();

  useEffect(() => {
    if (user) {
      console.log("User is logged in:", user);
    }
  }, [user]);

  return (
    <nav className="bg-black p-4 flex justify-between items-center shadow-md">
      <button
        className="text-white font-semibold text-xl flex items-center gap-2"
        onClick={() => router.push("/page")}
      >
        To Do <FaCheck />
      </button>
      <div className="flex space-x-2">
        {user ? (
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md flex items-center gap-2 hover:bg-red-600 transition duration-300"
            onClick={logout} 
          >
            <FaSignOutAlt /> Sign Out
          </button>
        ) : (
          <>
            <button
              className="bg-white text-black px-4 py-2 rounded-lg shadow-md flex items-center gap-2 hover:bg-gray-200 transition duration-300"
              onClick={() => router.push("/register")}
            >
              <FaUserPlus /> Sign Up
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md flex items-center gap-2 hover:bg-red-600 transition duration-300"
              onClick={() => router.push("/login")}
            >
              <FaSignInAlt /> Log In
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
