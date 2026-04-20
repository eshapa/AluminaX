import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {

  const nav = useNavigate();

  const [data, setData] = useState({
    role: "student"
  });

  const register = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/register", data);
      alert("Registered Successfully");
      nav("/login");
    } catch {
      alert("Error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md border">

        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Create Account
        </h2>

        <div className="space-y-4">

          <input
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
            placeholder="Full Name"
            onChange={e => setData({ ...data, name: e.target.value })}
          />

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

          <input
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
            placeholder="Profession (e.g Student / Software Engineer)"
            onChange={e => setData({ ...data, profession: e.target.value })}
          />

          <select
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
            onChange={e => setData({ ...data, role: e.target.value })}
          >
            <option value="student">Student</option>
            <option value="alumni">Alumni</option>
          </select>

          <button
            onClick={register}
            className="w-full bg-gray-900 text-white p-3 rounded-lg font-semibold hover:bg-black transition duration-300"
          >
            Register
          </button>

        </div>

        <p
          className="text-center text-gray-600 mt-5 cursor-pointer hover:text-black"
          onClick={() => nav("/login")}
        >
          Already have an account? <span className="font-semibold">Login</span>
        </p>

      </div>
    </div>
  );
}