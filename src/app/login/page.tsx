"use client";
import { useAuth } from "@/context/AuthContext";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation simple
    if (!email || !password) {
      setError("Email and password are required");
      toast.error("Email and password are required");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Invalid email format");
      toast.error("Invalid email format");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Envoi de la requête à l’API
      const res = await axios.post(
        "https://backendtodolist-production-5d7d.up.railway.app/auth/login",
        { email, password },
        { withCredentials: true }
      );

      if (res.status === 201) {
        localStorage.setItem("user", JSON.stringify(res.data.user)); // Stocke tout l'utilisateur
        router.push("/Taskboard");
        setEmail("");
        setPassword("");
        toast.success("Logged in successfully!");
      }
    } catch (err: any) {
      console.error(err);
      setError("Invalid credentials or something went wrong.");
      toast.error("Invalid credentials or something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h1 className="text-3xl font-semibold text-center text-gray-700 mb-6">Login</h1>
        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-600">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-red-500 text-black"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-600">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-red-500 text-black"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full p-3 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Log In"}
          </button>
        </form>
      </div>

      {/* Toast Container pour afficher les notifications */}
      <ToastContainer />
    </div>
  );
};

export default Login;
