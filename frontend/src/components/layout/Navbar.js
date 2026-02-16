"use client";

import { logout } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="bg-blue-600 text-white p-4 flex justify-between">
      <h1 className="font-bold">Finance Tracker</h1>
      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}
