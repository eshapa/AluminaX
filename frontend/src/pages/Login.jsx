import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {

  const nav = useNavigate();
  const [data, setData] = useState({});

  const login = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", data);

      localStorage.setItem("userId", res.data._id);

      if (!res.data.profileCompleted) {
        if (res.data.role === "student") nav("/student-profile");
        else nav("/alumni-profile");
      } else {
        if (res.data.role === "student") nav("/student");
        else nav("/alumni");
      }

    } catch {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md border">

        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Welcome Back
        </h2>

        <div className="space-y-4">

          <input
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
            placeholder="Email Address"
            onChange={e => setData({ ...data, email: e.target.value })}
          />

          <input
            type="password"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
            placeholder="Password"
            onChange={e => setData({ ...data, password: e.target.value })}
          />

          <button
            onClick={login}
            className="w-full bg-gray-900 text-white p-3 rounded-lg font-semibold hover:bg-black transition duration-300"
          >
            Login
          </button>

        </div>

        <p
          className="text-center text-gray-600 mt-5 cursor-pointer hover:text-black"
          onClick={() => nav("/register")}
        >
          Don’t have an account? <span className="font-semibold">Register</span>
        </p>

      </div>
    </div>
  );
}