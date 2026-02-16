"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name,
            email,
            password
          })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      // After successful registration → go to login
      router.push("/login");

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 shadow rounded w-80"
      >
        <h2 className="text-xl mb-4">
          Register
        </h2>

        {error && (
          <p className="text-red-500 mb-3">
            {error}
          </p>
        )}

        <input
          className="border p-2 w-full mb-3"
          placeholder="Name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
        />

        <input
          className="border p-2 w-full mb-3"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          type="password"
          className="border p-2 w-full mb-3"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button
          type="submit"
          className="bg-green-600 text-white w-full p-2"
        >
          Register
        </button>

        <p className="text-sm mt-3 text-center">
          Already have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer"
            onClick={() => router.push("/login")}
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}
