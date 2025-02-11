"use client"
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/dist/client/components/navigation';


const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!name || !email || !password || !phone) {
      setError('All fields are required.');
      return;
    }

    if (!/^06\d{8}$|^07\d{8}$/.test(phone)) {
      setError('Phone number must be in the format: 06XXXXXXXX or 07XXXXXXXX');
      return;
    }

    try {
      // Send registration data to the backend using axios
      const res = await axios.post('http://localhost:3000/auth/register', {
        name,
        email,
        password,
        phone,
      });

      if (res.status === 201) {
        console.log('User registered successfully!');
        setName('');
        setEmail('');
        setPassword('');
        setPhone('');
        setError('');
       router.push('./loging');
      
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (err) {
      // Log the full error to the console
      console.error('Error during registration:', err);

      // If there is a response error, display it
      if (err.response) {
        console.error('Backend error:', err.response.data);
        setError(err.response.data.message || 'Something went wrong. Please try again.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h1 className="text-3xl font-semibold text-center text-gray-700 mb-6">Register</h1>
        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-600">Full Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-red-500 text-black"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-black">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-red-500 text-black"
              required
            />
          </div>

          <div className="mb-4">
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

          <div className="mb-6">
            <label htmlFor="phone" className="block text-gray-600">Phone</label>
            <input
              type="text"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-red-500 text-black"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full p-3 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
