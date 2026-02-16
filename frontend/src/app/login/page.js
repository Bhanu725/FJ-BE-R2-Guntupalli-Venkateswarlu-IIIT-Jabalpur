"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveToken } from "@/lib/auth";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      }
    );

    const data = await res.json();

    if (data.token) {
      saveToken(data.token);
      router.push("/dashboard");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit}
        className="bg-white p-6 shadow rounded w-80">

        <h2 className="text-xl mb-4">Login</h2>

        <input
          className="border p-2 w-full mb-3"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="border p-2 w-full mb-3"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="bg-blue-500 text-white w-full p-2">
          Login
        </button>

        <button
          type="button"
          onClick={() =>
            window.location.href =
              `${process.env.NEXT_PUBLIC_API_URL}/auth/google`
          }
          className="bg-red-500 text-white w-full p-2 mt-3"
        >
          Login with Google
        </button>

      </form>
    </div>
  );
}
